const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
};
export const getUserLevel = async (token) => {
  const response = await fetch(`${API_URL}/user/user-level/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  // saving the status code in a variable
  const res = await response.json();
  res.status = response.status;
  return res;
};

export const finish_profile = async (formdata) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/user/finish_profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(formdata),
  });
  if (response.ok) {
    return true;
  }
  return {
    error: await response.json(),
  };
};


// {{base_url}}/user/send_code/

export const send_code = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/user/send_code/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  if (response.ok) {
    return true;
  }
  try {
    return {
      error: await response.json(),
    };
  } catch (e) {
    return {
      error: "There was an error with sms service. Please try again later.  ",
    };
  }
  return {
    error: await response.json(),
  };
}
export const verify_code = async (code) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/user/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  if (response.ok) {
    return true;
  }
  try {
    return {
      error: await response.json(),
    };
  } catch (error) {
    return {
      error: "Invalid Code",
    };
  }
  
}



export const register = async (formdata) => {
  const response = await fetch(`${API_URL}/user/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formdata),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  return { error: data };
};




// {{base_url}}/user/get-all-users/


export const get_all_users = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/user/get-all-users/`, {
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
}