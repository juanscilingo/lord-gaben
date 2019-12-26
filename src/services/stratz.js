import Axios from "axios";

const STRATZ_API_URL = 'https://api.stratz.com/api/v1';
const axios = Axios.create({ baseURL: STRATZ_API_URL });

export const match = async id => {
  console.log('Fetching match id: ', id)
  try {
    const match = await axios.get(`/match/${id}`);
    console.log(match)
    return match;
  } catch (error) {
    throw error;
  }
}