import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-16 md:mt-20"> 
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;