import React from 'react'
import { Link } from "react-router-dom";
import { Tag } from 'primereact/tag';

export const EventCard = (props) => {
    const API_URL = import.meta.env.VITE_APP_SERVER_URL;
    const starting_date = new Date(props.e.starting_date_time);
    const starting_formattedDate = `${starting_date.getDate()}/${starting_date.getMonth() + 1}/${starting_date.getFullYear()} ${starting_date.getHours()}:${starting_date.getMinutes()}`;

    const ending_date = new Date(props.e.ending_date_time);
    const ending_formattedDate = `${ending_date.getDate()}/${ending_date.getMonth() + 1}/${ending_date.getFullYear()} ${ending_date.getHours()}:${ending_date.getMinutes()}`;



    return (
        <div className="col">
            <Link className="link-card" to={`/evenement/${props.e.id}`}>
                <div className="img-gradient"  style={{ height: '15rem', width: '100%', overflow: 'hidden', borderRadius: '6px 6px 0 0' }}>

                    <img
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    className="img_event" alt="image" src={API_URL + props.e.cover} />
                </div>
                <div className="content">
                    <div className='content-first-half'>
                        <div className="location">
                            <i className=" pi pi-map" style={{ fontSize: '1.2rem' }}></i>&nbsp;{props.e.location}
                        </div>
                        <div className="titer-clubs">{props.e.name}</div>
                        <div className="date">
                            <i className=" pi pi-calendar-clock" style={{ fontSize: '1rem' }}></i>&nbsp;{starting_formattedDate} - {ending_formattedDate}
                        </div>

                    </div>
                    <div className="content-second-half">
                        {props.e.event_type === 'public' ?
                            <Tag className="mr-2" icon="pi pi-globe" severity="success" value="Public"></Tag>
                            : <Tag className="mr-2" icon="pi pi-lock" severity="warning" value="Private"></Tag>}
                    </div>
                </div>
            </Link>
        </div>
    )
}

