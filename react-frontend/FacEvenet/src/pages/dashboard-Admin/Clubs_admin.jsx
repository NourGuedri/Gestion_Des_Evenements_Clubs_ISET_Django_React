import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './clubs_admin.css';
import { Form_clubs } from "./Form_clubs";
import { get_clubs } from "../../services/clubservices";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

export const Clubs_admin = () => {
  const API_URL = import.meta.env.VITE_APP_SERVER_URL;



  const [clubs, setClubs] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    field: '',
    department: '',
    manager: '',
    logo: '',
    member: '',
  });
  const [searchTerm, setSearchTerm] = useState(''); // Add this line

  const [action, setAction] = useState('');

  useEffect(() => {
    get_clubs().then((data) => {
      if (data.error) {
        console.log("Error: ", data.error);
      } else {
        setClubs(data);
        console.log("Clubs: ", data);
      }

    });
  }, []);



  const handleDialogShow = (id) => {
    if (id) {
      const clubToEdit = clubs.find(club => club.id === id);
      setFormData(clubToEdit);
      setAction('edit');
    } else {
      setFormData({ id: null, name: '', description: '', field: '', department: '', manager: '', image: '' });
      setAction('add');
    }
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };
  const handledelteclub = (id) => {
    // affiche messsge de confirmation de suppression
    // si oui

    // supprimer le membre
    // rediriger vers la page Clubs_president
    const valid = confirm("Are you sure you want to delete this club?");
    if (valid) {

    } else {
      // Do nothing
    }
  }

  return (
    <>
      <div className="app-content">
        <div className="app-content-header">
          <h1 className="app-content-headerText">Clubs</h1>
          <Button label="Add Clubs" icon="pi pi-plus" onClick={() => handleDialogShow(null)} />
        </div>
        <div className="app-content-actions">
          <div className="search-bar p-inputgroup flex-1">
            <InputText className="search-bar" onChange={e => setSearchTerm(e.target.value)} placeholder="Search" />
            <Button icon="pi pi-search" className="p-button-warning" />
          </div>
        </div>
        <div className="clubs">
          <div className="flex-row">
            <div className="clubs-card-container">

              {clubs.filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase())).map((club) => (
                // <div className="col" key={club.id}>
                //   <div className="card">
                //     <img src={API_URL + club.logo}
                //       alt="" className="card-image" 
                //       />
                //     <p className="card-title">Club : {club.name}</p>
                //     <p className="card-title">department : {club.department}</p>
                //     <p className="card-body">Members : {club.members?.length}</p>
                //     <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'right', height: '80px', alignItems: 'center' }}>
                //       <Button label="Delete" severity="danger" icon="pi pi-trash" onClick={() => handledelteclub(club.id)} />
                //       <Button icon="pi pi-pencil" onClick={() => handleDialogShow(club.id)} label="Edit" severity="help" raised />
                //     </div>


                //   </div>
                // </div>
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
                    <>
                      <Button label="Delete" severity="danger" icon="pi pi-trash" onClick={() => handledelteclub(club.id)} />
                      &nbsp; &nbsp;

                      <Button icon="pi pi-pencil" onClick={() => handleDialogShow(club.id)} label="Edit" severity="help" raised />
                    </>
                  }
                >
                  
                  <p><b>Manager: </b>{club.manager}</p>
                  <p><b>Department: </b>{club.department}</p>
                  <p className="m-0"> 
                  <b>Description: </b>
                    {club.description}
                  </p>
                  <p>
                  <b>Members: </b>
                  {club.members.length}
                  </p>
                </Card>

              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog header={action === 'add' ? "Add Clubs" : "Edit Clubs"} visible={dialogVisible} style={{ width: '50vw', height: '100vh' }} onHide={handleCloseDialog}>
        <Form_clubs formData={formData} />
      </Dialog>
    </>
  );
}
