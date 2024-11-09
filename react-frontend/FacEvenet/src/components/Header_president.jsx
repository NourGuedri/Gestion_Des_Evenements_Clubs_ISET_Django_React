import React, { useEffect,useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './header.css';

export const Header_president = () => {
  const location = useLocation();// Utilisation de useLocation pour obtenir l'URL actuelle
  const [club_id, setClub_id] = useState(null);
  // get club id from the url params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setClub_id(params.get('club_id'));
  }, [location]);
  
  return (
    <nav>
      <aside>
        <p> President </p>
        <Link to={`/president?club_id=${club_id}`} className={location.pathname === `/president?club_id=${club_id}` ? "active" : ""}> 
          <i className="pi pi-cog" aria-hidden="true"></i>
          Dashboard
        </Link>
        <Link to={`./clubs_president?club_id=${club_id}`} className={location.pathname === `/president/clubs_president?club_id=${club_id}` ? "active" : ""}>
          <i className="pi pi-question" style={{ fontSize: '1rem' }}></i>
          Questions
        </Link>
        <Link to={`./evenements_president?club_id=${club_id}`} className={location.pathname === `/president/evenements_president?club_id=${club_id}` ? "active" : ""}>
          <i className="pi pi-clone" style={{ fontSize: '1rem' }}></i>
          Evenements
        </Link>
        <hr />
        <Link to="/logout"> 
          <i className="pi pi-sign-out" style={{ fontSize: '1rem' }}></i>
          Log out
        </Link>
      </aside>
    </nav>
  );
};
