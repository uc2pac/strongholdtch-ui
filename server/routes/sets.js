const express = require('express');
const router = express.Router();

// GET /api/sets - List all sets with optional game filter
router.get('/', async (req, res) => {
  try {
    const { game } = req.query;
    let query = `
      SELECT 
        s.id, 
        s.name, 
        s.game, 
        s.code,
        s.total_cards,
        s.created_at, 
        s.updated_at,
        COUNT(c.id) as card_count
      FROM sets s
      LEFT JOIN cards c ON s.id = c.set_id
    `;
    
    const queryParams = [];
    
    if (game) {
      query += ' WHERE s.game = $1';
      queryParams.push(game);
    }
    
    query += ' GROUP BY s.id, s.name, s.game, s.code, s.total_cards, s.created_at, s.updated_at ORDER BY s.created_at DESC';
    
    const result = await req.db.query(query, queryParams);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sets/:id - Get a specific set with all its cards
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get set info
    const setResult = await req.db.query(
      'SELECT * FROM sets WHERE id = $1',
      [id]
    );
    
    if (setResult.rows.length === 0) {
      return res.status(404).json({ error: 'Set not found' });
    }
    
    // Get cards for this set
    const cardsResult = await req.db.query(
      'SELECT * FROM cards WHERE set_id = $1 ORDER BY number ASC',
      [id]
    );
    
    const set = setResult.rows[0];
    set.cards = cardsResult.rows;
    
    res.json(set);
  } catch (error) {
    console.error('Error fetching set:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sets - Create a new set
router.post('/', async (req, res) => {
  const client = await req.db.connect();
  
  try {
    await client.query('BEGIN');
    
    const { name, game, code, totalCards, cards } = req.body;
    
    // Validate required fields
    if (!name || !game || !cards || !Array.isArray(cards)) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, game, and cards array' 
      });
    }
    
    // Validate game type
    const validGames = ['pokemon', 'lorcana', 'magic', 'yugioh', 'other'];
    if (!validGames.includes(game)) {
      return res.status(400).json({ 
        error: 'Invalid game type. Must be one of: ' + validGames.join(', ') 
      });
    }
    
    // Create the set
    const setResult = await client.query(
      'INSERT INTO sets (name, game, code, total_cards) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.trim(), game, code?.trim() || null, totalCards || null]
    );
    
    const newSet = setResult.rows[0];
    
    // Insert cards
    const insertedCards = [];
    for (const card of cards) {
      if (!card.name || card.number === undefined) {
        throw new Error('Each card must have a name and number');
      }
      
      const cardResult = await client.query(
        'INSERT INTO cards (set_id, name, number) VALUES ($1, $2, $3) RETURNING *',
        [newSet.id, card.name.trim(), parseInt(card.number)]
      );
      
      insertedCards.push(cardResult.rows[0]);
    }
    
    await client.query('COMMIT');
    
    // Return the complete set with cards
    newSet.cards = insertedCards;
    res.status(201).json(newSet);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating set:', error);
    
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Duplicate card number in set' });
    } else if (error.message.includes('Each card must have')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({  error });
    }
  } finally {
    client.release();
  }
});

// PUT /api/sets/:id - Update a set
router.put('/:id', async (req, res) => {
  const client = await req.db.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { name, game, code, totalCards, cards } = req.body;
    
    // Check if set exists
    const setExists = await client.query('SELECT id FROM sets WHERE id = $1', [id]);
    if (setExists.rows.length === 0) {
      return res.status(404).json({ error: 'Set not found' });
    }
    
    // Update set
    const setResult = await client.query(
      'UPDATE sets SET name = $1, game = $2, code = $3, total_cards = $4 WHERE id = $5 RETURNING *',
      [name.trim(), game, code?.trim() || null, totalCards || null, id]
    );
    
    // Delete existing cards and insert new ones
    await client.query('DELETE FROM cards WHERE set_id = $1', [id]);
    
    const insertedCards = [];
    for (const card of cards) {
      const cardResult = await client.query(
        'INSERT INTO cards (set_id, name, number) VALUES ($1, $2, $3) RETURNING *',
        [id, card.name.trim(), parseInt(card.number)]
      );
      
      insertedCards.push(cardResult.rows[0]);
    }
    
    await client.query('COMMIT');
    
    const updatedSet = setResult.rows[0];
    updatedSet.cards = insertedCards;
    res.json(updatedSet);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating set:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// DELETE /api/sets/:id - Delete a set
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await req.db.query(
      'DELETE FROM sets WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Set not found' });
    }
    
    res.json({ message: 'Set deleted successfully', deletedSet: result.rows[0] });
  } catch (error) {
    console.error('Error deleting set:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sets/:setId/cards/:cardId - Delete a specific card from a set
router.delete('/:setId/cards/:cardId', async (req, res) => {
  try {
    const { setId, cardId } = req.params;
    
    // First, verify that the set exists
    const setExists = await req.db.query(
      'SELECT id FROM sets WHERE id = $1',
      [setId]
    );
    
    if (setExists.rows.length === 0) {
      return res.status(404).json({ error: 'Set not found' });
    }
    
    // Check if the card exists and belongs to this set
    const cardExists = await req.db.query(
      'SELECT * FROM cards WHERE id = $1 AND set_id = $2',
      [cardId, setId]
    );
    
    if (cardExists.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found in this set' });
    }
    
    // Delete the card
    const result = await req.db.query(
      'DELETE FROM cards WHERE id = $1 AND set_id = $2 RETURNING *',
      [cardId, setId]
    );
    
    res.json({ 
      message: 'Card deleted successfully', 
      deletedCard: result.rows[0] 
    });
    
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
