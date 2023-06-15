import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Dice from './pages/Dice.tsx'
import './styles/App.css'

function App() {

  return (
    <div className='app--container'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dice" element={<Dice />} />
      </Routes>
    </div>
  )
}

export default App
