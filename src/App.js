import './App.css';
import React, { Fragment, useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter as Router,
  Routes, //switch
  Route,
  Navigate //redirect
} from "react-router-dom"


// components

import Dashboard from './components/dashboard';
import Login from './components/login';
import Signup from './components/signup';

toast.configure();

function App() {

  // make user unauthenticated first
  const [IsAuthenticated,setIsAuthenticated] = useState(false)


  // check and verify the token
  const setAuth = (Boolean) => {
    setIsAuthenticated(Boolean);
  };

  async function checkAuth (){
    try {
      const response = await 
      fetch("http://localhost:5000/auth/verify",
      {
        method:"GET",
        headers:{token : localStorage.token}
      });

      const parseRes = await response.json()
      
      parseRes === true ? setIsAuthenticated(true):
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    checkAuth();
  },[]);

  return (
    <Fragment>
      <Router>
          <Routes>
            <Route exact path='/login'
             element={ !IsAuthenticated ? <Login setAuth={setAuth}/> : <Navigate to="/dashboard"/> }/>
            <Route exact path='/signup' 
            element={ !IsAuthenticated ? <Signup setAuth={setAuth}/> : <Navigate to="/login"/>}/>
            <Route exact path='/dashboard' 
            element={ IsAuthenticated ? <Dashboard setAuth={setAuth}/> : <Navigate to="/login"/>}/>
          </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
