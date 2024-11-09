import React, { useEffect, useRef, useState } from "react";
import "./Clubs.css";

import { Link } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { NavBar } from "../../components/navbar";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import { get_all_clubs, request_membership } from "../../services/clubservices";

export const Clubs = () => {
  const API_URL = import.meta.env.VITE_APP_SERVER_URL;
  const toast = useRef(null);

  const [clubs, setClubs] = useState([]);
  const [note, setNote] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const accept = (club, note) => {
    request_membership(club.id,note).then((data) => {
      if (data.error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: data.error });
      } else {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Request sent successfully' });
        setVisible(false);
        setNote('');
      }
    });
  }

  const showConfirmation = (club) => {
    setSelectedClub(club);
    setVisible(true);
  }

  useEffect(() => {
    get_all_clubs().then((data) => {
      if (data.error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: data.error });
      } else {
        setClubs(data);
      }
    });
  }, []);

  return (
    <div className="home">
      <Toast ref={toast} />
      <Dialog 
        visible={visible} 
        onHide={() => setVisible(false)} 
        header="Confirmation" 
        style={
          {
            width: '30rem',
            
          }
        }
        footer={
          <div>
            <Button label="No" onClick={() => setVisible(false)} />
            <Button label="Yes" onClick={() => accept(selectedClub, note)} />
          </div>
        }
      >
        Are you sure you want to proceed?<br />
        A request will be sent to the club manager.<br />
        And you will be contacted soon.<br />
        <InputText value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note ?" />
      </Dialog>
      <div className="div">
        <NavBar />
        <div className="clubs-card-container">
          {clubs.map((club) => (
            <Card
              title={club.name}
              subTitle={club.field}
              style={{ width: '23rem' }}
              key={club.id}
              header={() => (
                <div style={{ height: '15rem', width: '100%', overflow: 'hidden', borderRadius: '6px 6px 0 0' }}>
                  <img
                    alt={club.name}
                    src={API_URL + club?.logo}
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              footer={
                <Button label="Ask to Join" onClick={() => showConfirmation(club)} />
              }
            >
              <p className="m-0">
                {club.description}
              </p>
              <p>Manager: {club.manager}</p>
              <p>Department: {club.department}</p>
            </Card>
          ))}
        </div>
      </div >
    </div >
  );
};