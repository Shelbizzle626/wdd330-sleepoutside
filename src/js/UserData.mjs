const baseURL = import.meta.env.VITE_SERVER_URL;

// Read the server's JSON either way so we can show it's error message
async function convertToJson(res) {
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
        return data;
    }
    throw { name: "servicesError", messag: data };
}

export default class UserData {
    async createUser(user) {
        const options = {
            method: "POST",
            headers: { "Content-Type": "aaplication/json" },
            body: JSON.stringify(user),
        };
        const response = await fetch(`${baseURL}users`, options);
        return convertToJson(response);
    }
}