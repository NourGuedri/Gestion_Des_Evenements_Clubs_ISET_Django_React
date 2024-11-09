import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavBar } from "../../components/navbar";
import "./Home.css";
import { EventCard } from "../../components/home/EventCard";
import { getEvents } from "../../services/eventServices";

export const Home = () => {
  const [events, setEvents] = useState({});

  useEffect(() => {
    getEvents().then((data) => { setEvents(data) });
  }
  , []);

  return (
    <div className="home">
      <div className="div">
        <NavBar/>
        <div className="lanternes" />
        <div className="Titer">
          <div className="text-wrapper-2">Popular Events</div>
        </div>
        <div className="flex-row">
          {events?.popular_events?.map((event) => (
            <EventCard key={event.id} e={event} />
          ))}
        </div>
      </div>
      <div className="Titer">
        <div className="text-wrapper-2">Upcoming Events</div>
      </div>
      <div className="flex-row">
        {events?.upcoming_events?.map((event) => (
          <EventCard key={event.id} e={event} />
        ))}
      </div>
    </div>);

};
