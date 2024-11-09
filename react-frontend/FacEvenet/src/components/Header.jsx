import React from "react";
import { Link, useLocation } from "react-router-dom";
import './header.css';

export const Header = () => {
  const location = useLocation();// Utilisation de useLocation pour obtenir l'URL actuelle
  
  return (
    <nav>
      <aside>
        <p> Admin </p>
        <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}> 
          <i className="pi pi-cog" aria-hidden="true"></i>
          Dashboard
        </Link>
        <Link to="./clubs_admin" className={location.pathname === "/admin/clubs_admin" ? "active" : ""}>
          <i className="pi pi-building" style={{ fontSize: '1rem' }}></i>
          Clubs
        </Link>
        <Link to="./evenements_admin" className={location.pathname === "/admin/evenements_admin" ? "active" : ""}>
          <i className="pi pi-clone" style={{ fontSize: '1rem' }}></i>
          Evenements
        </Link>
        <hr />
        <Link to="/home"> 
          <i className="pi pi-home" style={{ fontSize: '1rem' }}></i>
          Back Home
        </Link>
        <Link to="/logout"> 
          <i className="pi pi-sign-out" style={{ fontSize: '1rem' }}></i>
          Log out
        </Link>
        {/* back to /home */}
        

      </aside>
    </nav>
  );
};
