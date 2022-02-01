import api from './api'

export async function get(url) {
    const response = await api.get(url);    
    return response.data;
}

