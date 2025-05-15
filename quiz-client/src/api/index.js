import axios from 'axios';

//export const BASE_URL = process.env.REACT_APP_API_URL || '/';
export const BASE_URL = process.env.REACT_APP_API_URL;

export const ENDPOINTS = {
  participant: 'Participant',
  question: 'Question',
  getAnswers: 'question/getanswers'
}

export const createAPIEndpoint = endpoint => {

  let url = BASE_URL + 'api/' + endpoint;

  return {
    fetch: (config) => axios.get(url, config), 
    fetchById: id => axios.get(`${url}/${id}`),
    post: newRecord => axios.post(url, newRecord),
    put: (id, updatedRecord) => axios.put(`${url}/${id}`, updatedRecord),
    delete: id => axios.delete(`${url}/${id}`),
  }
}