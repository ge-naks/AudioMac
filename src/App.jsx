import './App.css'
import { Route, Routes, } from 'react-router-dom';
import Exp from './Exp.jsx';
import Home from './Home';
import Test from './Test';

function App() {

  return (
    <Routes>
      <Route path='/' element= {<Home />}/>
      <Route path='/exp' element ={<Exp/>} />
      <Route path='/test' element ={<Test/>} />
    </Routes>
  )
}

export default App
