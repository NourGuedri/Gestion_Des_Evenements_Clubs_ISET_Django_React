import React, { useState, useEffect } from "react";
export const Club = (props) => {
  const [club, setClub] = useState(null);
  const { id } = useParams(); // get the id from the URL
  const API_URL = import.meta.env.VITE_APP_SERVER_URL;

  useEffect(() => {
    if (!club) {
      handleGetClubById();
    }
  }, [club, id]); // add id to the dependency array

  const handleGetClubById = async () => {
    getClubById(id).then((data) => {
      setClub(data.club);
    });
  }

  return (
    <div className="club">
      <div className="content-club">
        <div className="img-club">
          <img className="img_club" alt="logo" src={API_URL + club?.logo} />
        </div>
        <div className="content-right">
          <div className="name-club">{club?.name}</div>
          <div className="field">{club?.field}</div>
          <div className="department">{club?.department}</div>
        </div>
      </div>
    </div>
  );
};