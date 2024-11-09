import React, { useState, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import './style_from.css';
import { get_all_users } from "../../services/authservices";
import { update_club, add_club } from "../../services/clubservices";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
export const Form_clubs = (formData) => {
    const [users, setUsers] = useState([]);
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newFormData, setNewFormData] = useState(formData?.formData || {});
    const [selectedUser, setSelectedUser] = useState(formData?.formData?.manager || '');
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        field: '',
        department: '',
        manager: '',
        logo: ''
    });
    formData = formData.formData;

    const handleChange = (e, fieldName) => {
        console.log(selectedUser)
        const { value } = e.target;
        setNewFormData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
        // Clear the error message when user starts typing
        setErrors(prevState => ({
            ...prevState,
            [fieldName]: ''
        }));

    };

    const handleFileUpload = (e) => {
        const file = e.files[0];
        setNewFormData(prevState => ({
            ...prevState,
            logo: file
        }));
        // Clear the error message when user selects a file
        setErrors(prevState => ({
            ...prevState,
            logo: ''
        }));
    };

    const handleSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (formData.id == null) {
            add_club(newFormData).then((data) => {
                if (data.error) {
                    console.log("Error: ", data.error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data.error.error, life: 3000 });
                    setIsLoading(false);
                } else {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Club added successfully', life: 3000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                

            });
        } else {
            // submit the form
            update_club(newFormData).then((data) => {
                if (data.error) {
                    console.log("Error: ", data.error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data.error, life: 3000 });
                    setIsLoading(false);
                } else {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Club updated successfully', life: 3000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });
        }

    };



    const selectedUserTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.first_name} {option.last_name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };
    const UserOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                {/* <i> user icon */}

                <div>{option?.first_name} {option?.last_name} - {option.profile?.group}</div>
            </div>
        );
    };
    const handleGetUsers = () => {
        get_all_users().then((data) => {
            if (data.error) {
                console.log("Error: ", data.error);
            } else {
                const usersWithName = data.map(user => ({
                    ...user,
                    name: `${user.first_name} ${user.last_name}`
                }));
                setUsers(usersWithName);
                console.log("Users: ", usersWithName);
            }
        });
    };

    return (

        <form onSubmit={handleSubmit} className="form">
            <Toast ref={toast} />
            <div className="form-field">
                <label htmlFor="name" className="form-label">Name</label>
                <InputText id="name" value={newFormData.name} onChange={(e) => handleChange(e, 'name')} className="form-input" />
                {errors.name && <small className="form-error">{errors.name}</small>}
            </div>
            <div className="form-field">
                <label htmlFor="description" className="form-label">Description</label>
                <InputText id="description" value={newFormData.description} onChange={(e) => handleChange(e, 'description')} className="form-input" />
                {errors.description && <small className="form-error">{errors.description}</small>}
            </div>
            <div className="form-field">
                <label htmlFor="field" className="form-label">Field</label>
                <InputText id="field" value={newFormData.field} onChange={(e) => handleChange(e, 'field')} className="form-input" />
                {errors.field && <small className="form-error">{errors.field}</small>}
            </div>
            <div className="form-field">
                <label htmlFor="department" className="form-label">Department</label>
                <InputText id="department" value={newFormData.department} onChange={(e) => handleChange(e, 'department')} className="form-input" />
                {errors.department && <small className="form-error">{errors.department}</small>}
            </div>
            <div className="form-field">
                <label htmlFor="manager" className="form-label">Manager</label>
                <br />
                <Dropdown value={selectedUser} onClick={() => { handleGetUsers() }} onChange={(e) => { handleChange(e, 'manager'); setSelectedUser(e.value) }} options={users} optionLabel="name" placeholder={selectedUser}
                    filter valueTemplate={selectedUserTemplate} itemTemplate={UserOptionTemplate} className="w-full md:w-14rem" />
                {errors.manager && <small className="form-error">{errors.manager}</small>}
            </div>
            <div className="form-field">
                <label className="form-label">Change Club Logo</label>
                <FileUpload mode="basic" name="logo" accept="image/*" maxFileSize={1000000} onSelect={handleFileUpload} className="form-input" />
                {errors.logo && <small className="form-error">{errors.logo}</small>}
            </div>
            <Button type="submit" label="Submit" icon="pi pi-check" loading={isLoading} />
        </form>
    );
}
