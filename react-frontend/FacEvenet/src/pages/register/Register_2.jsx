import React, { useState,useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';
import { finish_profile,getUserLevel } from '../../services/authservices';

import './Register_2.css';

export function Register_2() {
    
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(true);



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getUserLevel(token).then((status) => {
                if (status === 400) {
                    setVisible(false);
                    window.location.href = '/verification';
                }
                else if (status === 200) {
                    setVisible(false);
                    window.location.href = '/home';
                }
            });
        }
    }, []);


    const [formData, setFormData] = useState({
        phone_number: '',
        email: '',
        university: '',
        department: '',
        group: '',
    });
    const [errors, setErrors] = useState({
        phone_number: '',
        email: '',
        university: '',
        department: '',
        group: '',
    });

    const handleChange = (e, fieldName) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
        setErrors(prevState => ({
            ...prevState,
            [fieldName]: ''
        }));
    };

    const handleSubmit = () => {
        setIsLoading(true);

        // Validation logic here
        let errors = {};

        // Check if phone number is exactly 6 digits
        if (!/^(\d{8})$/.test(formData.phone_number)) {
            errors.phone_number = 'Phone number must contain exactly 6 digits';
        }

        // Add similar checks for other fields here...

        // If there are errors, set them in the 'errors' state
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        } else {
            // If there are no errors, call the API
            finish_profile(formData).then((data) => {
                console.log(data);
                if (data.error) {
                    // set data.error keys in the 'errors' state
                    setErrors(data.error);
                } else {
                    console.log('Profile finished successfully');
                    // Handle successful API call here
                    setVisible(false);
                    window.location.href = '/verification';
                }
            });
        }

        setIsLoading(false);
    };

    const handleLogout = () => {

        localStorage.removeItem('token');
        window.location.href = '/home';

    };
    const footerContent = (
        <div>
            <Button label="Logout"  severity='danger' icon="pi pi-sign-out" onClick={() => handleLogout()} className="p-button-text" />
            <Button label="Finish" loading={isLoading} severity='success' icon="pi pi-check" onClick={() => handleSubmit()} autoFocus />
        </div>
    );

    return (
        <div className='finish-profile-main-container'>
            <Dialog header="Finish Your Profile" draggable={false} closable={false} visible={visible} style={{ width: '50vw', height: '100vh' }} onHide={() => setVisible(false)} footer={footerContent}>

                <form  className='finish-profile-form' onSubmit={handleSubmit}>
                    <div>
                        <FloatLabel className="floating-label" for="phone_number">
                            <InputText id="phone_number" value={formData.phone_number} onChange={(e) => handleChange(e, 'phone_number')} />
                            <label htmlFor="phone_number">Phone Number</label>
                        </FloatLabel>
                        {errors.phone_number && <Message severity="error" text={errors.phone_number} />}
                    </div>
                    <div>
                        <FloatLabel for="email">
                            <InputText id="email" value={formData.email} onChange={(e) => handleChange(e, 'email')} />
                            <label htmlFor="email">Email</label>
                        </FloatLabel>
                        {errors.email && <Message severity="error" text={errors.email} />}
                    </div>
                    <div>
                        <FloatLabel for="university">
                            <InputText id="university" value={formData.university} onChange={(e) => handleChange(e, 'university')} />
                            <label htmlFor="university">University</label>
                        </FloatLabel>
                        {errors.university && <Message severity="error" text={errors.university} />}
                    </div>
                    <div>
                        <FloatLabel for="department">
                            <InputText id="department" value={formData.department} onChange={(e) => handleChange(e, 'department')} />
                            <label htmlFor="department">Department</label>
                        </FloatLabel>
                        {errors.department && <Message severity="error" text={errors.department} />}
                    </div>
                    <div>
                        <FloatLabel for="group">
                            <InputText id="group" value={formData.group} onChange={(e) => handleChange(e, 'group')} />
                            <label htmlFor="group">Group</label>
                        </FloatLabel>
                        {errors.group && <Message severity="error" text={errors.group} />}
                    </div>
                </form>
            </Dialog>
        </div>
    );
}