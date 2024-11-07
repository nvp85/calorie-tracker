import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import LandingPage from "./Components/LandingPage/LandingPage";
import FoodSearch from './Components/FoodSearch/FoodSearch';
import FoodItem from './Components/FoodItem/FoodItem';
import Journal from './Components/Journal/Journal';
import RecordsProvider from './Components/RecordsProvider/RecordsProvider';
import NotFound from './Components/NotFound/NotFound';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage/>} />
          <Route element={<RecordsProvider />}>
            <Route path='/search' element={<FoodSearch/>} />
            <Route path='/food/:id' element={<FoodItem/>} />
            <Route path='/journal' element={<Journal/>} />
          </Route>
          <Route path='*' element={<NotFound/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          {
          // 
          //
          //<Route path='/profile' element={<Profile/>} />
          //
          //<Route path='/add_food' element={<NewFood/>} />
          }
        </Route>
      </Routes>
    </BrowserRouter>
  )
};

export default App;
