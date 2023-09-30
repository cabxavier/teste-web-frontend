import PontosTuristicos from './components/PontosTuristicos';
import Sobre from './components/Sobre';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>Pontos Turísticos</h1>
      <BrowserRouter>
        <Nav variant="tabs">
          <Nav.Link as={Link} to="/">Cadastro de Pontos Turísticos</Nav.Link>
          <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
        </Nav>
        <Routes>
          <Route path="/" element={<PontosTuristicos />}></Route>
          <Route path="/sobre" element={<Sobre />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
