import React, { useState, useRef, useEffect } from 'react';
import './login.css';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Message } from 'primereact/message';
import { login, getUserLevel } from '../../services/authservices';
import { Toast } from 'primereact/toast';


export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [serverErrors, setServerErrors] = useState('')
  const [usernameErrors, setUsernameErrors] = useState('')
  const [passwordErrors, setPasswordErrors] = useState('')
  const toast = useRef(null);

  useEffect(() => {
    // get message from url
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    if (message) {
      toast.current.show({ severity: 'success', summary: 'Success', detail: message });
    }
  }, []);

  const handleSubmit = (e) => {
    setIsLoading(true)
    e.preventDefault();
    login(username, password).then((data) => {
      console.log(data);
      setIsLoading(false)
      if (data.error) {
        // check if data.error has "non_field_errors" key
        if (data.error.non_field_errors) {
          setServerErrors(data.error.non_field_errors[0])
        }
        // else check for "username" key
        else if (data.error.username) {
          setUsernameErrors(data.error.username[0])
        }
        // else check for "password" key
        else if (data.error.password) {
          setPasswordErrors(data.error.password[0])
        }
      } else {
        console.log(data)
        localStorage.setItem('token', data.key)
        window.location.href = '/home';
      }
    }
    )
  }

  return (
    <div className='main-container'>
      <Toast ref={toast} />

      <div className='x-c' />
      {/* <div className='frame' /> */}
      <div className='frame-1' >

        <span className='titer-login'>Login</span>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='input' >
            <label htmlFor="cin" >Cin : </label><br />
            <InputText id="cin" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Cin' className='p-inputtext' />
            {usernameErrors != '' ? <p style={{ color: 'red' }}>{usernameErrors}</p> : null}
          </div>
          <div className='input'>
            <label htmlFor="password"  >Password :</label><br />
            <Password
              placeholder={`${passwordErrors != '' ? passwordErrors : 'Password'}`}
              tabIndex={1}
              invalid={passwordErrors != '' ? true : false}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="errors-container">
            {serverErrors != '' ? <Message severity="error" text={serverErrors} /> : null}
          </div>
          <Button loading={isLoading} type='submit' label="Submit" severity="success" raised />

        </form>

        <span className='or'>OR</span><br />
        <div className='text'>
          <span >Don't have an account? <Link to="/register" >Register</Link></span>
        </div>
      </div>
    </div>
  );
}