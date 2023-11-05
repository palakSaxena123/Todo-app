import React, { useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Todo from './Components/Todo';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
   return (
      <BrowserRouter>
         {/* <ToastContainer /> */}
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/todo' element={<Todo />} />

         </Routes>
      </BrowserRouter>
      // <NewTodo/>

   )
}

export default App;
