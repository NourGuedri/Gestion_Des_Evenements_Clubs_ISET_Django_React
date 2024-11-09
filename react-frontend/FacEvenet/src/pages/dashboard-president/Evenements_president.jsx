import React, { useState, useEffect,useRef } from "react";
import './Evenements_president.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Form_evenements } from "./Form_evenement";
import { useLocation } from 'react-router-dom';
import { get_club_events,cancelEvent } from '../../services/eventServices';

import { Toast } from 'primereact/toast';

export const Evenements_president = () => {
    const location = useLocation();// Utilisation de useLocation pour obtenir l'URL actuelle
    const toast = useRef(null);
    const [events, setEvents] = useState([]);
    const [club_id, setClub_id] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        organizing_club: '',
        starting_date_time: '',
        ending_date_time: '',
        location: '',
        max_attendees: '',
        event_type: '',
        cover: '',
    })

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const clubId = params.get('club_id');
        setClub_id(clubId);
        // set club_id to to form data
        setFormData(prevState => ({
            ...prevState,
            organizing_club: clubId
        }));


        get_club_events(clubId).then((data) => {
            if (!data.error) {
                setEvents(data);
                console.log(data);
                // rank the events with event.status=="canceled" at the end
                const sortedEvents = data.sort((a, b) => {
                    if (a.status === "canceled") {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            }
        });
    }, [events]);

   
    const [dialogVisible, setDialogVisible] = useState(false);

    const [action, setAction] = useState('');

    const handleDialogShow = (id) => {
        if (id) {
            const eventToEdit = events.find(event => event.id === id);
            setFormData(eventToEdit);
            setAction('edit');
        } else {
            setFormData({
                id: null,
                name: '',
                description: '',
                organizing_club: '',
                starting_date_time: '',
                ending_date_time: '',
                location: '',
                max_attendees: '',
                event_type: '',
                cover: '',
            });
            setAction('add');
        }
        setDialogVisible(true);
    };

    const handleCloseDialog = () => {
        setDialogVisible(false);
    };

    const handleCancel = (id) => {
        cancelEvent(id).then((data) => {
            if (!data.error) {
                setEvents(events.filter(event => event.id !== id));
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Event cancelled successfully' });
            }
        });
    }

    return (
        <>
        <Toast ref={toast} />   
            <div className="app-content">
                <div className="app-content-header">
                    <h1 className="app-content-headerText">Evenements</h1>
                    <Button label="Add Evenements" icon="pi pi-plus" className="app-content-headerButton" onClick={() => handleDialogShow(null)} />
                </div>
                <div className="app-content-actions">
                    <input className="search-bar" placeholder="Search..." type="text" />
                </div>
                <div className="products-area-wrapper tableView">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Organizing Club</th>
                                <th>Starting Date & Time</th>
                                <th>Ending Date & Time</th>
                                <th>Location</th>
                                <th>Max Attendees</th>
                                <th>Event Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => {

                            console.log(event);
                            console.log("--------------------------------------");
                            
                            return (
                                
                                <tr 
                                key={event.id}
                                style={
                                    event?.status === "canceled" ? {backgroundColor: "rgba(220, 38, 38,0.5)"} : {}
                                }
                                >
                                    <td>{event.name}</td>

                                    <td>{event.organizing_club.name}</td>
                                    <td>{event.starting_date_time}</td>
                                    <td>{event.ending_date_time}</td>
                                    <td>{event.location}</td>
                                    <td>{event.max_attendees}</td>
                                    <td>{event.event_type}</td>
                                    <td>
                                        {event.status}
                                    </td>
                                    <td>
                                    {event?.status != "canceled" ?
                                    <Button
                                        onClick={()=>handleCancel(event.id)}
                                    label="Cancel" severity="danger" icon="pi pi-ban" />
                                    : <h2 style={{textAlign:'center'}}>🚫</h2>}

                                    </td>
                                </tr>
                            )})}

                        </tbody>
                    </table>
                </div>
            </div>
            <Dialog header={action === 'add' ? "Add Event" : "Edit Event"} visible={dialogVisible} style={{ width: '50vw' }} onHide={handleCloseDialog}>
                <Form_evenements clubId={club_id} action={action} formData={formData} />
            </Dialog>
        </>
    );
}
