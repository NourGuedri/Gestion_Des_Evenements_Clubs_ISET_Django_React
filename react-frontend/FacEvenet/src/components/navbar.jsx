import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// prime react btn
import { Button } from "primereact/button";
import { getUserLevel } from "../services/authservices";

export const NavBar = () => {
  const [role, setRole] = useState("president");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [managedClubs, setManagedClubs] = useState([]);

  useEffect(() => {
    // get the key from the local storage
    const key = localStorage.getItem('token');

    if (key) {
      setIsLoggedIn(true);
      getUserLevel(key).then((res) => {
        console.log(res);
        if (res.status === 200) {
          
          setIsAdmin(res.is_admin);
          setManagedClubs(res.managed_clubs);
          

        } else if (res.status === 400) {
          window.location.href = '/verification';
        } else if (res.status === 404) {
          window.location.href = '/registerinformation';
        }
      }
      )
    }

  }, []);
  

  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
  };

  return (
    <>
      <div className="auth-nav">
        <div className="num">contact support:📞 94 950 169 | 📧 hbechir52@gmail.com</div>
        <ul>
          
          {/* Condition pour afficher "Log out" si l'utilisateur est connecté */}
          {isLoggedIn ? (
            <>
            {isAdmin == true ? (
              <li>
                <Link to="/admin" className="link">
                  <Button label="Admin Dashboard" severity="success" outlined />
                </Link>
              </li>
            ):null}
            {managedClubs && managedClubs.length!=0 && (
              <li>
                {managedClubs.map((club) => (
                  <Link to={`/president?club_id=${club.id}`} className="link">
                    <Button label={`${club.name} Dashboard`} severity="warning" outlined />
                  </Link>
                ))}
              </li>
            )}
            <li>
              <Button onClick={handleLogout} label="Logout" severity="help" outlined />
            </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">
                  <Button label="Register" severity="secondary" outlined />
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <Button label="Login" severity="primary" />
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar">
        <h1>FacEvent</h1>
        <ul>
          <li>
            <Link to="/home" className="link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/clubs" className="link">
              Clubs
            </Link>
          </li>

        </ul>
      </div>
    </>
  );
};

export default NavBar;
