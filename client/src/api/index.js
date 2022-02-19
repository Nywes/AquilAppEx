import axios from 'axios'

var clientPort = 3000

const api = axios.create ({
    baseURL: `http://localhost:${clientPort}/api/user_api`,
});

export const createUserDB = () => api.post(`/create_user_db`);
export const createMeetingDB = () => api.post(`/create_meeting_db`);

export const createUser = payload => api.post(`/create_user`, payload);
export const createMeeting = payload => api.post(`/create_meeting`, payload);

export const readUsers = () => api.post(`/users`);
export const readMeetings = () => api.post(`/meetings`);

const apis = {
    createUserDB,
    createMeetingDB,
    createUser,
    createMeeting,
    readUsers,
    readMeetings,
}

export default apis