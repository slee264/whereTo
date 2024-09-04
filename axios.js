import axios from 'axios';

export default axios = axios.create({
    baseURL: "http://demo.subsonic.org/rest/",
    timeout: 1000
})