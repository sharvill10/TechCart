import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
   
        <footer className="bg-slate-900 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>TechCart © {currentYear}</p>
          </div>
        </footer>

  );
}

export default Footer;
