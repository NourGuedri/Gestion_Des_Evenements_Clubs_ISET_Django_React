import React, { useState } from "react";
import "./Register_4.css";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export const Register_4 = () => {
    const [verifier, setVerifier] = useState(true);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (verifier){
            setVerifier(false);
        }else{
            window.location.href = '/home'
        }
        
    };

    return (
        <div className="image-register_2">
            <div className="register">
                <div className="div">
                    <div className="overlap-group">
                        <div className="frame" />
                        <div className="text-wrapper">2</div>
                        <hr className="green-hr"/>
                        <div className="text-wrapper-2">1</div>
                        <div className="frame-2" />
                    </div>
                    <div className="overlap-2">
                        <div className={`frame-3 ${verifier ? 'white' : 'green'}`} />
                        <hr className="green-hr-2"/>
                        <div className="text-wrapper-3">3</div>
                    </div>
                    {verifier ? (
                        <form onSubmit={handleSubmit}>
                            <table className="table_form">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="label font">Enter Code</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <InputText className="p-inputtext input_register" placeholder="Code" />
                                        </td>
                                        <td>
                                            <Button className="btn-register-4 " type="submit">
                                                <div className="text-2">Valid</div>
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="text-wrapper-1">Phone validation</div>
                        </form>
                    ) : (
                        <div>
                            <Button className="btn-home" type="button" onClick={handleSubmit}>
                                <div className="text-2">Go To Home Page</div>
                            </Button>
                            <div className="text-wrapper-7">Registration successfully completed</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
