import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Notification from "./pages/notification/Notification";
import Expenses from "./pages/expenses/Expenses";
import React, { useState, useEffect } from 'react';
import { withResizeDetector } from 'react-resize-detector';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";



// const containerStyles = {
//   height: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center'
// };





function App() {

  const { darkMode } = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };


 return (
  <div className={darkMode ? "app dark" : "app"}>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route
            index
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path="users">
            <Route
              index
              element={
                <RequireAuth>
                  <List />
                </RequireAuth>
              }
            />
            <Route
              path=":userId"
              element={
                <RequireAuth>
                  <Single />
                </RequireAuth>
              }
            />
            <Route
              path="new"
              element={
                <RequireAuth>
                  <New inputs={userInputs} title="Client Registration" />
                </RequireAuth>
              }
            />          
          </Route>
          <Route
              path="expenses"
              element={
                <RequireAuth>
                  <Expenses/>
                </RequireAuth>
              }
            ></Route>  
            <Route
              path="notification"
              element={
                <RequireAuth>
                  <Notification/>
                </RequireAuth>
              }
            ></Route> 
          {/* <Route path="products">
            <Route
              index
              element={
                <RequireAuth>
                  <List />
                </RequireAuth>
              }
            />
            <Route
              path=":productId"
              element={
                <RequireAuth>
                  <Single />
                </RequireAuth>
              }
            />
            <Route
              path="new"
              element={
                <RequireAuth>
                  <New inputs={productInputs} title="Add New Product" />
                </RequireAuth>
              }
            />
          </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
   
  </div>
);

}

export default App;
