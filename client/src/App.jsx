import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sets from './pages/Sets';
import SetDetails from './pages/SetDetails';
import CreateSet from './pages/CreateSet';


const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Sets />} />
        <Route path="/sets" element={<Sets />} />
        <Route path="/sets/pokemon" element={<Sets game="pokemon" />} />
        <Route path="/sets/lorcana" element={<Sets game="lorcana" />} />
        <Route path="/sets/magic" element={<Sets game="magic" />} />
        <Route path="/sets/yugioh" element={<Sets game="yugioh" />} />
        <Route path="/sets/create" element={<CreateSet />} />
        <Route path="/sets/:id" element={<SetDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;