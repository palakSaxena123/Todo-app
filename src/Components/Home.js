import React from 'react';
import "./Home.css";
import { Outlet, Link } from "react-router-dom";

const Home = () => {
  return (
    <>

    <div className='home-container'>
        <h1 >Welcome</h1>
        <nav>
          <button className='button type-1'>
         
        <Link className="btn-txt" to="/todo">Let's Start</Link>


        </button>
        </nav>
        <Outlet />
    </div>
    
    </>
  )
}

export default Home;