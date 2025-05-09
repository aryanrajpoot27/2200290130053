# Average Calculator Microservice

A microservice that calculates averages of different types of numbers (prime, Fibonacci, even, and random) using a sliding window approach.

# Features

- Supports multiple number types (prime, Fibonacci, even, random)
- Maintains a sliding window of unique numbers
- Calculates averages in real-time
- Handles timeouts and errors gracefully
- Ensures response time under 500ms

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The service will start on port 3000 by default.

## API Endpoints

### Get Numbers and Average
```
GET /numbers/{type}
```

Where `{type}` can be:
- `p` for prime numbers
- `f` for Fibonacci numbers
- `e` for even numbers
- `r` for random numbers

Example:
```
GET http://localhost:9876/numbers/e
```

Response:
```json
{
   "windowPrevState": [],
   "windowCurrState": [2, 4, 6, 8],
   "numbers": [2, 4, 6, 8],
   "avg": 5.00
}
```

## Implementation Details

- Window Size: 10 numbers
- Timeout: 500ms
- Maintains unique numbers only
- Replaces oldest numbers when window is full
- Calculates average to 2 decimal places 