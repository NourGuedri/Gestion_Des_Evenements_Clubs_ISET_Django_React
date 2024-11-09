const API_URL = import.meta.env.VITE_APP_SERVER_URL;

// admin --------------------------------------------------------

export const get_clubs = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/club/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return {
    error: data,
  };
};

// {{base_url}}/club/update-club
export const update_club = async (formdata) => {
  console.log(formdata);
  // create new formData object with the formdata
  const formData = new FormData();
  formData.append("id", formdata.id);
  formData.append("name", formdata.name);
  formData.append("description", formdata.description);
  formData.append("field", formdata.field);
  formData.append("department", formdata.department);

  if (formdata.manager.id) {
    formData.append("manager", formdata.manager.id);
  }
  // check if form logo is a File
  if (formdata.logo instanceof File) {
    formData.append("logo", formdata.logo);
  }

  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/club/update-club`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return {
    error: data,
  };
};

// {{base_url}}/club/add-club/
export const add_club = async (formdata) => {
  // create new formData object with the formdata
  const formData = new FormData();
  formData.append("name", formdata.name);
  formData.append("description", formdata.description);
  formData.append("field", formdata.field);
  formData.append("department", formdata.department);
  formData.append("manager", formdata.manager.id);
  // check if form logo is a File
  if (formdata.logo instanceof File) {
    formData.append("logo", formdata.logo);
  }

  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/club/add-club/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return {
    error: data,
  };
};

// users --------------------------------------------------------

// {{base_url}}/club/

export const get_all_clubs = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    const response = await fetch(`${API_URL}/club/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return {
      error: data,
    };
  } else {
    const response = await fetch(`${API_URL}/club/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return {
      error: data,
    };
  }
};

// {{base_url}}/club/request-membership
export const request_membership = async (id,note) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return {
      error: "You need to be logged in to request membership",
    };
  }

  const response = await fetch(`${API_URL}/club/request-membership`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ id: id, note: note }),
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return {
    error: data,
  };
};




// managers --------------------------------------------------------

// {{base_url}}/club/get-club-memberships
export const get_club_memberships = async (club_id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      error: "You need to be logged in to request membership",
    };
  }

  const response = await fetch(`${API_URL}/club/get-club-memberships?club_id=${club_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return {
    error: data,
  };
};

// {{base_url}}/club/toggle-membership-state
export const toggle_membership_state = async (membership_id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      error: "You need to be logged in to change membership state",
    };
  }

  const response = await fetch(`${API_URL}/club/toggle-membership-state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ membership_id: membership_id }),
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return {
    error: data,
  };
}


// {{base_url}}/club/get-club-stats?club_id=6

export const get_club_stats = async (club_id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      error: "You need to be logged in to request membership",
    };
  }

  const response = await fetch(`${API_URL}/club/get-club-stats?club_id=${club_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return {
    error: data,
  };
}
