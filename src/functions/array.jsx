import axios from 'axios';

const fetchGoodsFromServer  = async () => {
  try {
    const response = await axios.get('https://greencrem.onrender.com/api/goods');
    return response.data;
  } catch (error) {
    console.error('Error fetching goods:', error);
    return [];
  }
};

export default fetchGoodsFromServer;
