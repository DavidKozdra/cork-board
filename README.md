

# Corkboard MERN App

This repo and project are no longer active as of 2022

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing Corkboard-style content. This app includes both client and server code.
![image](https://github.com/user-attachments/assets/6739139d-8e93-4a3f-b1da-5740a046991f)

![image](https://github.com/user-attachments/assets/dbfeed9b-e004-421f-9606-d9acbefb20c0)

Project presentation for class https://docs.google.com/presentation/d/1UgeIdNwmKTbXaaXFBDlHFwLj6Oombo95sNyzFd6lqXM/edit?usp=sharing

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14+)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone this repository to your local machine:



2. Install dependencies for both the server and the client.

### Server Setup

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install server dependencies:

   ```bash
   npm install
   ```

3. Ensure MongoDB is running locally or accessible through a URI.

4. Define environment variables (see below for details).

5. Start the server:

   ```bash
   npm start
   ```

### Client Setup

1. Open a new terminal window and navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install client dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm run start
   ```

## Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```plaintext
# MongoDB connection settings
CORK_MONGO_IP=localhost:27017 # replace with your MongoDB server address

# Secret for session encryption
SECRET_COOKIE_PASSWORD=your_secret_password_here

# Environment (set to 'production' for production)
NODE_ENV=development
```

## Running the Application

To start the application:

1. **Start the MongoDB server** if it isn't running already. Ensure it's accessible via the IP address and port specified in your `.env` file.
2. **Run the server** by navigating to the `server` directory and executing:

   ```bash
   npm start
   ```

   The server will listen on the configured port (default is `localhost:5000`).

3. **Run the client** by navigating to the `client` directory and executing:

   ```bash
   npm start
   ```

   The client will open at `localhost:3000` by default.

## Project Structure

### Server (`server/`)

- **Dependencies**: bcrypt, cors, dotenv, express, iron-session, mongodb, socket.io
- **Scripts**:
  - `start`: Starts the server using Nodemon, hot-reloading on changes
- **Database**:
  - Uses MongoDB to store Corkboard data
  - Connection is established through `MongoClient` and retrieved with `getDb()`

### Client (`client/`)

- **Dependencies**: React, Material UI, Lodash, SWR, and React Router
- **Scripts**:
  - `start`: Starts the React development server
  - `build`: Creates a production build
  - `test`: Runs tests
