// {{base_url}}/user/general-stats

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const get_stats = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/user/general-stats`, {
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
