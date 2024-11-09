import React, { useState, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import './style_from.css';
import { request_event } from '../../services/eventServices';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export const Form_evenements = ({ club_id, action, formData }) => {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        organizing_club: '',
        starting_date_time: '',
        ending_date_time: '',
        location: '',
        max_attendees: '',
        event_type: '',
        cover: ''
    });
    const [selectedType, setSelectedType] = useState(null);
    const types = [
        { name: 'public' },
        { name: 'private' },

    ];



    const handleChange = (e, fieldName) => {
        if (e.target.value.name) {
            formData[fieldName] = e.target.value.name; // Update the form data
        } else {
            const { value } = e.target;
            formData[fieldName] = value; // Update the form data
            setErrors(prevState => ({
                ...prevState,
                [fieldName]: ''
            }));
        }
    };

    const handleFileUpload = (e) => {
        const file = e.files[0];
        formData['cover'] = file; // Update the form data
        setErrors(prevState => ({
            ...prevState,
            cover: ''
        }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const params = new URLSearchParams(location.search);
        const clubId = params.get('club_id');
        formData.organizing_club = clubId;
        request_event(formData).then((data) => {
            if (data.error) {
                const { error } = data;
                setErrors(error);
            } else {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Event added successfully', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            
            }
            setIsLoading(false); 
        }
        );

    };

    return (
        <div className="form-container">
            <Toast ref={toast} />
            <h1 className="form-title">{action === 'add' ? 'Add' : 'Edit'} Event</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-field">
                    <label htmlFor="name" className="form-label">Name</label>
                    <InputText id="name" value={formData.name} onChange={(e) => handleChange(e, 'name')} className="form-input" />
                    {errors.name && <small className="form-error">{errors.name}</small>}
                </div>
                <div className="form-field">
                    <label htmlFor="description" className="form-label">Description</label>
                    <InputTextarea id="description" value={formData.description} onChange={(e) => handleChange(e, 'description')} className="form-input" rows={5} cols={30} />

                    {errors.description && <small className="form-error">{errors.description}</small>}
                </div>

                <div className="form-field">
                    <label htmlFor="starting_date_time" className="form-label">Starting Date Time</label>
                    <input type="datetime-local" id="starting_date_time" value={formData.starting_date_time} onChange={(e) => handleChange(e, 'starting_date_time')} className="form-input" />
                    {errors.starting_date_time && <small className="form-error">{errors.starting_date_time}</small>}
                </div>
                <div className="form-field">
                    <label htmlFor="ending_date_time" className="form-label">Ending Date Time</label>
                    <input type="datetime-local" id="ending_date_time" value={formData.ending_date_time} onChange={(e) => handleChange(e, 'ending_date_time')} className="form-input" />
                    {errors.ending_date_time && <small className="form-error">{errors.ending_date_time}</small>}
                </div>
                <div className="form-field">
                    <label htmlFor="location" className="form-label">Location</label>
                    <InputText id="location" value={formData.location} onChange={(e) => handleChange(e, 'location')} className="form-input" />
                    {errors.location && <small className="form-error">{errors.location}</small>}
                </div>
                <div className="form-field">
                    <label htmlFor="max_attendees" className="form-label">Max Attendees</label>
                    <input type="number" id="max_attendees" value={formData.max_attendees} onChange={(e) => handleChange(e, 'max_attendees')} className="form-input" />
                    {errors.max_attendees && <small className="form-error">{errors.max_attendees}</small>}
                </div>
                <div className="form-field">
                    <label htmlFor="event_type" className="form-label">Event Type</label>
                    <Dropdown id="event_type" value={selectedType} options={types} onChange={(e) => { setSelectedType(e.value); handleChange(e, 'event_type') }} optionLabel="name" placeholder="Select a type" className="form-input" />
                    {errors.event_type && <small className="form-error">{errors.event_type}</small>}
                </div>
                <div className="form-field">
                    <label className="form-label">Cover</label>
                    <FileUpload mode="basic" name="cover" accept="image/*" maxFileSize={1000000} onSelect={handleFileUpload} className="form-input" />
                    {errors.cover && <small className="form-error">{errors.cover}</small>}
                </div>
                <Button loading={isLoading} label="Add" icon="pi pi-plus" severity="success"  type="submit" />
            </form>
        </div>
    );

}
