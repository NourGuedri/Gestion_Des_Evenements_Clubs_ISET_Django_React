import React, { useState, useEffect } from "react";
import './dashboard_president.css';
import { get_club_memberships } from "../../services/clubservices";
import { Button } from "primereact/button";
import { toggle_membership_state, get_club_stats } from "../../services/clubservices";

import { InputText } from 'primereact/inputtext';


export const Dashboard_president = () => {

    const [club_id, setClub_id] = useState(null);
    const [states, setStates] = useState([]);
    const [club_stats, setClub_stats] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    
    const [requests, setRequests] = useState([])
    const handleChangeState = (id) => () => {
        toggle_membership_state(id).then((res) => {
            if (res.error) {
                console.log(res.error);
            }
            else {
                setStates(states.map((state, index) => {
                    if (requests[index].id === id) {
                        return res.state;
                    }
                    return state;
                }));
            }
        }
        )
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const clubId = params.get('club_id');
        setClub_id(clubId);
    
        get_club_stats(clubId).then((res) => {
            if (res.error) {
                console.log(res.error);
            }
            else {
                setClub_stats(res);
            }
        });
    
        get_club_memberships(clubId).then((res) => {
            if (res.error) {
                console.log(res.error);
            }
            else {
                console.log(res);
                setRequests(res.memberships);
                setStates(res.memberships.map((member) => member.state));
            }
        });
    }, [setClub_id, setClub_stats, setRequests, setStates]);




    return (
        <div className="container">
            <div className="content">
                <div className="cards">
                    {Object.entries(club_stats).map(([key, value]) => (
                        <div className="card" key={key}>
                            <div className="box">
                                <h1>{value}</h1>
                                <h3>{key.replace(/_/g, " ")}</h3>
                            </div>
                            <div className="icon-case"></div>
                        </div>
                    ))}


                </div>
                <div className="content-2">
                    <div className="Request-join">
                        <div className="title">
                            <h2>Request join</h2>

                        </div>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>cin</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>University</th>
                                <th>Note</th>
                                <th>Actions</th>
                            </tr>
                            {requests.map((member, index) => {
                                {
                                let icon;
                                let severity;
                                switch (states[index]) {
                                    case "ACTIVE":
                                        icon = "pi pi-check";
                                        severity = "success";
                                        break;
                                    case "PENDING":
                                        icon = "pi pi-clock";
                                        severity = "warning";
                                        break;
                                    case "REMOVED":
                                        icon = "pi pi-ban";
                                        severity = "danger";
                                        break;
                                    default:
                                        icon = "";
                                        severity = "";
                                }

                                
                                        return (

                                            <tr key={member.id}>
                                                <td>
                                                    {member.user.first_name} {member.user.last_name}
                                                </td>
                                                <td>{member.user.cin}</td>
                                                <td>{member.user.profile.email}</td>
                                                <td>{member.user.profile.phone_number}</td>
                                                <td>{member.user.profile.department}</td>
                                                <td>{member.user.profile.university}</td>
                                                <td>{member.note == "" ? "🚫" : member.note}</td>
                                                <td>
                                                    <Button
                                                        label={states[index]}
                                                        severity={severity}
                                                        icon={icon}
                                                        onClick={handleChangeState(member.id)}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                }
                            })}

                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}