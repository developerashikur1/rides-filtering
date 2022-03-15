import './App.css';
import Rides from './components/Rides/Rides';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';

function App() {
  return (
    <>
      <Router>
        <Header></Header>
        <Routes>
          <Route path='/' element={<Rides></Rides>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
