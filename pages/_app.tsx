import "../styles/globals.css";
import type { AppProps } from "next/app";

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { WorkoutsContextProvider } from "../context/WorkoutContext";
import { FilesContextProvider } from "../context/FileContext";
import { AuthContextProvider } from "../context/AuthContext";

// pages & components
//import Navbar from "./../components/Navbar";

function App({ Component, pageProps }) {
  return (
    <div className="app">
      {/* <Navbar /> */}
      <AuthContextProvider>
        <FilesContextProvider>
          <WorkoutsContextProvider>
            <Component {...pageProps} />
          </WorkoutsContextProvider>
        </FilesContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
