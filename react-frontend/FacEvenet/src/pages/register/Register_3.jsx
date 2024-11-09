import React, { useState } from "react";
import "./Register_3.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { send_code, verify_code } from "../../services/authservices";
import { Message } from 'primereact/message';


export const Register_3 = () => {
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [firstVisible, setFirstVisible] = useState(true);
    const [secondVisible, setSecondVisible] = useState(false);
    const [resendTimeLeft, setResendTimeLeft] = useState(0);




    const handleSendCode = () => {
        setIsLoading(true);
        send_code().then((data) => {
            if (data.error) {
                setError(data.error);
                setFirstVisible(false);
                setSecondVisible(true);
                setIsLoading(false);
            } else {
                setFirstVisible(false);
                setSecondVisible(true);
            }
            setIsLoading(false);
        });
    }
    const handleVerifyCode = () => {
        setIsLoading(true);
        verify_code(code).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setSecondVisible(false);
                window.location.href = '/home';
            }
            setIsLoading(false);
        });
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/home';
    }

    const firstfooter = (
        <div>

            <Button label="Disagree" severity="danger" icon="pi pi-times" onClick={() => handleLogout()} />
            <Button loading={isloading} label="Agree" icon="pi pi-check" onClick={() => { handleSendCode() }} />
        </div>
    );
    const secondfooter = (
        <div className="phone-verif-footer">
            <Button label="Cancel" severity="danger" icon="pi pi-times" onClick={() => handleLogout()} />
            <Button loading={isloading} label="Resend Code" outlined severity="help" className="phone-verif-resend-button" onClick={() => handleSendCode()} />
            <Button label="Submit" loading={isloading} icon="pi pi-check" onClick={() => { handleVerifyCode() }} />
        </div>
    );

    return (
        <div className="phone-outer-verif-container">
            <Dialog header="Phone Verification" footer={firstfooter} visible={firstVisible} style={{ width: '50vw' }} onHide={() => setFirstVisible(false)}>
                We will send you a text message with a verification code to the phone number you provided.
                <br />
                <br />
                {error.message && <Message severity="error" text={error.message} />}
            </Dialog>

            <Dialog header="Phone Verification" footer={secondfooter} visible={secondVisible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <div className="phone-verif-container">
                    <div className="phone-verif-title">Enter the code we sent to your phone</div>
                    <div className="phone-verif-input-container">
                        <InputText
                            id="phone-verif-input"
                            className="phone-verif-input"
                            placeholder="Enter the code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    {error.message && <Message severity="error" text={error.message} />}

                </div>
            </Dialog>

        </div>
    );
};
