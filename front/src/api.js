export const API_URL = "http://localhost:3000/"


const axios = require('axios');

// Function to make a PUT request
async function makePutRequest(endpoint, data) {
    try {
        const response = await axios.put(`http://localhost:3000/`, data);
        console.log('PUT response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in PUT request:', error);
    }
}

// Function to make a DELETE request
async function makeDeleteRequest(endpoint) {
    try {
        const response = await axios.delete(`http://localhost:3000/`);
        console.log('DELETE response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in DELETE request:', error);
    }
}

// // Function to make a POST request
// export async function makePostRequest(data) {
//     try {
//         const response = 
//         console.log('POST response:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error in POST request:', error);
//     }
// }