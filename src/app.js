const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;
const API_BASE_URL = 'http://20.244.56.144/evaluation-service';
const WINDOW_SIZE = 10;
const TIMEOUT = 500;

const AUTH_CREDENTIALS = {
    "email": "aryan.2226it1129@kiet.edu",
    "name": "aryan rajpoot",
    "rollNo": "2200290130053",
    "accessCode": "SxVeja",
    "clientID": "4d2603f1-0e2e-47b7-9303-8437b1a8de70",
    "clientSecret": "pdWbHDzUbPmPbFSm"
};

let currentToken = null;
let tokenExpiry = null;
const numberWindow = new Set();
const numberQueue = [];

async function getNewToken() {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth`, AUTH_CREDENTIALS);
        currentToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        return currentToken;
    } catch (error) {
        console.error('Error getting new token:', error.message);
        throw error;
    }
}

async function getValidToken() {
    if (!currentToken || !tokenExpiry || Date.now() >= tokenExpiry) {
        await getNewToken();
    }
    return currentToken;
}

app.use(cors());
app.use(express.json());

async function fetchNumbers(type) {
    try {
        const token = await getValidToken();
        const response = await axios.get(`${API_BASE_URL}/${type}`, {
            timeout: TIMEOUT,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message);
        return [];
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return Number((sum / numbers.length).toFixed(2));
}

function updateNumberWindow(newNumbers) {
    const prevState = [...numberQueue];
    
    newNumbers.forEach(num => {
        if (!numberWindow.has(num)) {
            if (numberQueue.length >= WINDOW_SIZE) {
                const oldest = numberQueue.shift();
                numberWindow.delete(oldest);
            }
            numberQueue.push(num);
            numberWindow.add(num);
        }
    });

    return {
        windowPrevState: prevState,
        windowCurrState: [...numberQueue],
        numbers: newNumbers,
        avg: calculateAverage(numberQueue)
    };
}

app.post('/numbers/:type', async (req, res) => {
    const { type } = req.params;
    const validTypes = ['p', 'f', 'e', 'r'];
    
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const typeMap = {
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };

    const numbers = await fetchNumbers(typeMap[type]);
    const result = updateNumberWindow(numbers);
    
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 