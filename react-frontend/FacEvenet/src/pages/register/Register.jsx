import React, { useEffect, useState } from 'react';
import './Register.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { register } from '../../services/authservices';
import { Message } from 'primereact/message';



export default function Register() {

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(true);





  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: '',
  });
  useEffect(() => {
    // on change of any field set errors to empty
    setErrors({
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      confirm_password: '',
    });
  }, [formData]);
  const handleRegister = () => {
    setIsLoading(true);
    register(formData)
      .then((data) => {
        if (data.error) {
          setErrors(data.error);
          console.log(data.error);
        } else {
          window.location.href = `/login?message=${data.message}`
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

  };

  const footer = (
    <div className='register-footer-container'>
      <div className='link-container'>
        <Link to='/login'>Already have an account? Login</Link>
      </div>
      <div className='button-container'>
        <Button
          icon="pi pi-check"
          label='Register'
          loading={isLoading}
          className=''
          onClick={() => {
            handleRegister();
          }}
        />
      </div>

    </div>
  );



  return (
    <div className='main-container'>
      <Dialog header="Register" footer={footer} closable={false} visible={visible} style={{ width: '70vw',height:'100vh' }} draggable={false}>
        <div className='register-container'>
          <div className='input-container'>
            <div className='input-wrapper'>
              <span className='p-float-label'>
                <InputText
                  invalid={errors.first_name}
                  id='first_name'
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <label htmlFor='first_name'>First Name</label>
                {errors.first_name && <Message severity='error' text={errors.first_name} /> }

              </span>
            </div>
            <div className='input-wrapper'>
              <span className='p-float-label'>
                <InputText
                  invalid={errors.last_name}
                  id='last_name'
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                <label htmlFor='last_name'>Last Name</label>
                {errors.last_name && <Message severity='error' text={errors.last_name} /> }
              </span>
            </div>
            <div className='input-wrapper'>
              <span className='p-float-label'>
                <InputText
                  invalid={errors.username}
                  
                  id='username'
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <label htmlFor='username'>CIN</label>
                {errors.username && <Message severity='error' text={errors.username} /> }
              </span>
            </div>
            <div className='input-wrapper'>
              <span className='p-float-label'>
                <Password
                  invalid={errors.password}
                  id='password'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <label htmlFor='password'>Password</label>
                {errors.password && <Message severity='error' text={errors.password} /> }
              </span>
            </div>
            <div className='input-wrapper'>
              <span className='p-float-label'>
                <Password
                  invalid={errors.confirm_password} 
                  id='confirm_password'
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                />
                <label htmlFor='confirm_password'>Confirm Password</label>
                {errors.confirm_password && <Message severity='error' text={errors.confirm_password} /> }
              </span>
            </div>
          </div>
        </div>
      </Dialog>


    </div>
  );
}
