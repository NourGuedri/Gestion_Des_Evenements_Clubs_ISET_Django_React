import React, { useState } from "react";
import './Evenements_admin.css';
import { useEffect } from "react";
import { getEventsAdmin } from "../../services/eventServices";
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';
import { toggleEventStatus } from "../../services/eventServices";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export const Evenements_admin = () => {
    const [events, setEvents] = useState([]);
    const [values, setValues] = useState([]);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Add this line

    useEffect(() => {
        getEventsAdmin().then((data) => {
            setEvents(data);
            console.log(data);
            setValues(data.map((event) => event?.status));
        });
    }, []);
    const options = [
        { value: 'pending', icon: 'pi pi-clock' },
        { value: 'approved', icon: 'pi pi-check' },
        { value: 'rejected', icon: 'pi pi-ban' }
    ];

    const handleEventAction = (eventId, index) => {
        setSending(true);
        toggleEventStatus(eventId).then((data) => {
            if (data.error) {
                alert(data.error.message);
                setSending(false);
            } else {
                const newValues = [...values];
                newValues[index] = data.status;
                setValues(newValues);
                setSending(false);
            }
        });
    }

    return (
        <>
            <div className="app-content">
                <div className="app-content-header">
                    <h1 className="app-content-headerText">Evenements</h1>
                </div>
                <div className="app-content-actions">
                    <div className="search-bar p-inputgroup flex-1">
                        <InputText className="search-bar" onChange={e => setSearchTerm(e.target.value.toLowerCase())} placeholder="Search" />
                        <Button icon="pi pi-search" className="p-button-warning" />
                    </div>
                </div>
                <div className="products-area-wrapper tableView">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Organizing Club</th>
                                <th>Starting Date & Time</th>
                                <th>Ending Date & Time</th>
                                <th>Location</th>
                                <th>Max Attendees</th>
                                <th>Event Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.filter(event => event.name.toLowerCase().includes(searchTerm)).map((event, index) => { // Modify this line
                                return (
                                    <tr key={index}>
                                        <td>{event?.name}</td>
                                        <td>{event?.description}</td>
                                        <td>{event?.organizing_club?.name}</td>
                                        <td>{event?.starting_date_time}</td>
                                        <td>{event?.ending_date_time}</td>
                                        <td>{event?.location}</td>
                                        <td>{event?.max_attendees}</td>
                                        <td>{event?.event_type}</td>
                                        {event.status === 'ended' || event.status === 'canceled' || event.status === 'delayed' || event.status === 'started' ? <td>{event?.status}</td> :

                                            <td>
                                                <div style={{ width: '120px' }} className="card flex flex-column align-items-center gap-3">

                                                    <MultiStateCheckbox
                                                        disabled={sending}
                                                        key={index}
                                                        value={values[index]} // Use the index to get the value for this checkbox
                                                        onChange={(e) => {
                                                            handleEventAction(event.id, index);
                                                        }}
                                                        options={options}
                                                        optionValue="value"

                                                    />&nbsp;
                                                    <label htmlFor="msc">{values[index]}</label>
                                                </div>
                                            </td>
                                        }

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}