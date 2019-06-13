const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

let database = {
    users: [{
        id: '123',
        name: 'John',
        email: 'john@gmail.com',
        password: 'cookies',
        entries: 0,
        joined: new Date()
    }, {
        id: '124',
        name: 'Sally',
        email: 'sally@gmail.com',
        password: 'bananas',
        entries: 0,
        joined: new Date()
    }, {
        id: '125',
        name: 'Antonio',
        email: 'antonio@me.com',
        password: 'pelota',
        entries: 0,
        joined: new Date()
    }]
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    let password = req.body.password;

    /*bcrypt.hash(password, saltRounds, (err, hash) => {
        bcrypt.compare(password, hash, (err, res) => {
            console.log(res);
        });
    });*/

    if (database.users[0].email === email && database.users[0].password === password) {
        res.json(database.users[0]);
    } else {
        res.status(404).json('Incorrect email + password combination');
    }
});

app.post('/register', (req, res) => {
    database.users.push({
        id: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        joined: new Date()
    });
    const registeredUser = database.users[database.users.length-1];
    const user = {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        entries: registeredUser.entries,
        joined: registeredUser.joined
    };
    res.send(user);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

// API DESIGN:
// 1: Login
// 2: Register
// 3: RANK
// 4: Profile
// 5: Image