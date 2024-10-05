import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar"
import LandingPage from "./Components/LandingPage/LandingPage"

function App() {
  return (
    <BrowserRouter>
      <Navbar>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          {
          // <Route path="/Login" element={<Login/>}/>
          //<Route path='/Sign_Up' element={<Sign_Up/>}/>
          //<Route path='/profile' element={<Profile/>} />
          //<Route path='/journal' element={<Journal/>} />
          //<Route path='/search' element={<FoodSearch/>} />
          //<Route path='/add_food' element={<NewFood/>} />
          }
        </Routes>
      </Navbar>
    </BrowserRouter>
  )
};

export default App;
