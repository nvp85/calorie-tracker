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
import AuthProvider from './hooks/AuthProvider';
import NewFood from './Components/NewFood/NewFood';
import Profile from './Components/Profile/Profile';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage/>} />
            <Route element={<RecordsProvider />}>
              <Route path='/search' element={<FoodSearch/>} />
              <Route path='/food/:id' element={<FoodItem/>} />
              <Route path='/journal' element={<Journal/>} />
              <Route path='/addfood' element={<NewFood/>} />
            </Route>
            <Route path='*' element={<NotFound/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/profile' element={<Profile/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};

export default App;
