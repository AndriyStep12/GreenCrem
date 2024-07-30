import axios from 'axios';

const fetchOrdersFromServer = async () => {
    try {
        const response = await axios.get('https://greencrem.onrender.com/api/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching goods:', error);
        return [];
    }
};

export default fetchOrdersFromServer;
