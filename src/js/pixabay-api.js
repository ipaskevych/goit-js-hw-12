import axios from 'axios';

export async function getImagesByQuery(query, page = 1) {
  const API_KEY = '55981750-407047847782865d9c6ccfb62';
  const BASE_URL = 'https://pixabay.com/api/'

  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15, // Важливо: 15 картинок на сторінку
    }
  });
  
  return response.data;
}