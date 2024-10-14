import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/LandingPage/LandingPage";
import FoodSearch from './Components/FoodSearch/FoodSearch';
import FoodItem from './Components/FoodItem/FoodItem';
import Journal from './Components/Journal/Journal';


function App() {
  return (
    <BrowserRouter>
      <Navbar>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path='/search' element={<FoodSearch/>} />
          <Route path='/food/:id' element={<FoodItem/>} />
          <Route path='/journal' element={<Journal/>} />
          {
          // <Route path="/Login" element={<Login/>}/>
          //<Route path='/Sign_Up' element={<Sign_Up/>}/>
          //<Route path='/profile' element={<Profile/>} />
          //
          //<Route path='/add_food' element={<NewFood/>} />
          }
        </Routes>
      </Navbar>
    </BrowserRouter>
  )
};

export default App;
