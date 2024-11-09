const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/event`);
  const data = await response.json();
  return data;
};
export const getEventById = async (id) => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await fetch(
      `${API_URL}/event/event-qa-page?event_id=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }else{
    const response = await fetch(
      `${API_URL}/event/event-qa-page?event_id=${id}`
    );
    const data = await response.json();
    return data;
  }
  


};

export const attendEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/event/attend-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ event_id: eventId }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  if (response.status === 401) {
    return {
      error: { message: "You need to be logged in to attend an event" },
    };
  }
  return { error: data };
};
export const askQuestion = async (event_id, question) => {
  console.log(event_id, question);
  console.log("aaaaaaaaaaaaaaaaaa");


  const response = await fetch(`${API_URL}/event/ask-question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ event_id, question }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  if (response.status === 401) {
    return {
      error: { message: "You need to be logged in to ask a question" },
    };
  }
  return { error: data };
};


export const getEventsAdmin = async () => {
  const response = await fetch(`${API_URL}/event/admin-get-all-events`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data;
}



export const toggleEventStatus = async (eventId) => {
  const response = await fetch(`${API_URL}/event/toggle-event-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ event_id: eventId }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  if (response.status === 401) {
    return {
      error: { message: "You need to be logged in as an admin to toggle event status" },
    };
  }
  return { error: data };
};
  


// {{base_url}}/event/get-unanswerd-questions

export const get_unanswered_questions = async () => {
  const response = await fetch(`${API_URL}/event/get-unanswerd-questions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
}

// {{base_url}}/event/get-club-events


export const get_club_events = async (club_id) => {
  const response = await fetch(`${API_URL}/event/get-club-events?club_id=${club_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
}


// {{base_url}}/event/answer-question
export const answer_question = async (question_id,answer) => {
  const response = await fetch(`${API_URL}/event/answer-question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ question_id,answer }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
}


// {{base_url}}/event/request-event/

export const request_event = async (event) => {
  console.log(event);
  const formData = new FormData();
  for (const key in event) {
    formData.append(key, event[key]);
  }

  


  const response = await fetch(`${API_URL}/event/request-event`, {
    method: "POST",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
}



// {{base_url}}/event/cancel-event

export const cancelEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/event/cancel-event`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ event_id: eventId }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
}