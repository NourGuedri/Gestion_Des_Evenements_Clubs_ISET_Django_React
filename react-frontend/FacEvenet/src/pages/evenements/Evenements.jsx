import React, { useState } from "react";


import { Link } from "react-router-dom";

import { NavBar } from "../../components/navbar";

import "primeicons/primeicons.css";

export const Evenements = () => {
  const [evenements, setEvenements] = useState([
    {
      id: "1",
      name: "aze",
      description: "azer",
      field: "aez",
      organizing_club: "aez",
      starting_date_time: "aez",
      cover: "aea",
      ending_date_time: "aez",
      location: "aeaea",
      max_attendees: "aeae",
      event_type: "aeae",
    },
  ]);



  const handleEvenement = (id) => {
    history.push("/evenement/" + id); 
  }
  return (
    <div className="home">
      <div className="div">
        <NavBar />
        <div className="lanternes" />
        <div className="content-clubs">
          <div className="text-center text-xl">Evenements</div>
          <div className="list-Evenements">
            <div className="evenets">
              <div className="flex-row">
                {evenements.map((evenement) => (
                  <div
                    className="col"
                    key={evenement.id}
                    onClick={() => handleEvenement(evenement.id)}
                  >
                     <Link className="link-card" to="/evenement/{id}">
                    <img
                      className="img_event"
                      alt="image"
                      src="https://picsum.photos/200"
                    />
                    <div className="content">
                      <div className="titer-clubs">{evenement.name}</div>
                      <div className="date">
                        <i
                          className="pi pi-calendar-clock"
                          style={{ fontSize: "1rem" }}
                        ></i>
                        &nbsp;{evenement.starting_date_time}
                      </div>
                      <div className="location">
                        <i
                          className="pi pi-map"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        &nbsp;{evenement.location}
                      </div>
                      <div className="type-evenet">
                        {evenement.event_type}
                      </div>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
