import React, { useState, useEffect, useRef } from "react";
import "./Evenement.css";
import { Link } from "react-router-dom";
import { NavBar } from "../../components/navbar";
import { getEventById } from "../../services/eventServices";
import { useParams } from "react-router-dom";
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { attendEvent, askQuestion } from "../../services/eventServices";
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

import { Divider } from 'primereact/divider';

import 'primeicons/primeicons.css';
export const Evenement = (props) => {
  const [event, setEvent] = useState(null);
  const [attended, setAttended] = useState(false);
  const toast = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // get the id from the URL
  const API_URL = import.meta.env.VITE_APP_SERVER_URL;
  const [question, setQuestion] = useState("");


  useEffect(() => {
    if (!event) {
      handlegetEventById();
    }
  }, [event, id]); // add id to the dependency array
  const handlegetEventById = async () => {
    getEventById(id).then((data) => {
      setEvent(data.event);
      setQuestions(data.questions);
      setAttended(data?.event?.attending);
      console.log(data);

    });
  }

  const handleAttendEvent = async () => {
    setLoading(true);
    const response = await attendEvent(id);
    if (response.error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: response.error.message });
    } else {
      setAttended(!attended);
      handlegetEventById();
      toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
    }
    setLoading(false);
  }

  const handleAskQuestion = async () => {
    console.log(question);
    console.log("bbbbbbbbbbbbbbbbbbbbbbbbb");
    setLoading(true);
    const response = await askQuestion(id, question);
    if (response.error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: response.error.message });
    } else {
      toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
      setQuestion("");
      handlegetEventById();
    }
    setLoading(false);
  }


  return (
    <div className="home">
      <div className="div">
        <Toast ref={toast} />
        <NavBar />
        {/* <div className="lanternes" />   */}
        <div className="evenement">
          <div className="content-evenement">
            <div className="img-evenement">
              <img className="img_evenement" alt="image" src={API_URL + event?.cover} />
            </div>
            <div className="content-rigth">
              <div className="name-evenement">{event?.name}
                <Button
                  severity={!attended ? "success" : "danger"}
                  label={!attended ? "I'll Be There" : "I'm Out"}
                  onClick={() => handleAttendEvent()}
                  icon={!attended ? "pi pi-plus" : "pi pi-user-minus"}
                  loading={loading} />
              </div>
              <div className="club">{event?.organizing_club}</div>

              <div className="text-center text-xl">Description</div>
              <div className="description-evenement">
                {event?.description}
              </div>
              <div className="datedebut">
                <i className="pi pi-calendar-clock" style={{ fontSize: "1rem" }}></i>
                &nbsp;{event?.starting_date_time} &nbsp;   =={'>'} &nbsp;
                <i className="pi pi-calendar-clock" style={{ fontSize: "1rem" }}></i>
                &nbsp;{event?.ending_date_time}
              </div>
              <div className="lieu">
                <i className="pi pi-map-marker" style={{ fontSize: "1rem" }}></i>
                &nbsp;{event?.location}
              </div>

              <div className="participation">
                <i className="pi pi-users" style={{ fontSize: "1rem" }}></i>
                &nbsp;
                {event?.attendees.length} participants
                <div className="attendees-list">
                  {event?.attendees.map((attendee) => (
                    <>
                      <Chip className="attendee" label={`${attendee?.first_name} ${attendee?.last_name}`} />
                    </>
                  )
                  )}
                </div>

              </div>

            </div>

          </div>
          <Divider align="center">
            <div className="inline-flex align-items-center">
              <b>👇🏽{questions?.length} Questions In This Event.👇🏽</b>
            </div>
          </Divider>
        </div>


        <div className="questions">
          <div className="questions-list">
            {
              questions?.length === 0 ?
                <div className="text-center">No questions yet</div>
                :
                questions && questions[0] == 'unauthorized' ?
                  <div className="text-center">You need To Attend The Event To Ask and See Questions</div>
                  :

                  questions && questions.map((attendee) => (
                    <Chip className="question" label={`${attendee?.first_name} ${attendee?.last_name}`} />
                  ))
            }

          </div>
          {/* ask question */}

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">Cant's Find Your Question?</span>
            <InputText
              onChange={(e) => setQuestion(e.target.value)}

              disabled={!attended}
              placeholder={!attended ? "You need to attend the event to ask a question" : "Ask Your Question Here"} />
            <Button label="Ask"
              icon="pi pi-plus"
              onClick={() => handleAskQuestion()}
              disabled={!attended}

            />
          </div>

        </div>
      </div>
    </div>
  );
};
