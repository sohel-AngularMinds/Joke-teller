import api from './api'

export async function get(url) {
    const response = await api.get(url);
    // console.log(response);
    return response.data;
}