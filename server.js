const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const saltRounds = 10;

const database = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ####### ROOT ##########
app.get('/', (req, res) => {
    res.send("It's working");
    // return database.select("*")
    //     .from('users')
    //     .orderBy('id', 'asc')
    //     .then(data => res.json(data));
});

// ####### LOGIN ##########
app.post('/login', (req, res) => {
    login.handleLogin(req, res, database, bcrypt);
});

// ####### REGISTER ##########
app.post('/register', (req, res) => {
    register.handleRegister(req, res, database, bcrypt)
});

// ####### PROFILE ##########
app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, database);
});

// ####### IMAGE: INCREMENT ENTRIES ##########
app.put('/image', (req, res) => {
    image.handleImage(req, res, database);
});

// ####### IMAGE: CLARIFAI API CALL ##########
app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

// API DESIGN:
// 1: Login ->X
// 2: Register - POST => register user to DB and return registered user - X
// 4: Profile -> get => return user profile for the provided id - X
// 5: Image => PUT increase entries for the provided user - X