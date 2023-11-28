import React, { useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Todo from "../src/Components/Todo/Todo";
 import Home from "../src/Components/Home/Home";
//  import Form from './Components/Form/Form';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormModel from './Components/Form/FormModel';

function App() {
   return (
      <BrowserRouter>
         {/* <ToastContainer /> */}
         <Routes>
            <Route path="/" element={<Home/>} />
            <Route path='/todo' element ={<Todo/>}/>
           <Route path='/todo/add'  element={<FormModel/>}/>
         </Routes>
      </BrowserRouter>
   )
}
export default App;
