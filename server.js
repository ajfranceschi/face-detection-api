const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const database = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'afrances',
        password: '',
        database: 'smart-brain'
    }
});

database.select("*").from('users').then(data => console.log(data));

const app = express();
app.use(bodyParser.json());
app.use(cors());

// let database = {
//     users: [{
//         id: '123',
//         name: 'John',
//         email: 'john@gmail.com',
//         password: 'cookies',
//         entries: 0,
//         joined: new Date()
//     }, {
//         id: '124',
//         name: 'Sally',
//         email: 'sally@gmail.com',
//         password: 'bananas',
//         entries: 0,
//         joined: new Date()
//     }, {
//         id: '125',
//         name: 'Antonio',
//         email: 'antonio@me.com',
//         password: 'pelota',
//         entries: 0,
//         joined: new Date()
//     }]
// };


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
        const {id, name, email, entries, joined} = database.users[0];

        res.json({
            id: id,
            name: name,
            email: email,
            entries: entries,
            joined: joined
        });
    } else {
        res.status(404).json('Incorrect email + password combination');
    }
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;

    database('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            joined: new Date()
        })
        .then(user => res.json(user))
        .catch(error => res.status(400).json(error));

    // database.users.push({
    //     id: uuidv4(),
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     entries: 0,
    //     joined: new Date()
    // });
    // const registeredUser = database.users[database.users.length-1];
    // const user = {
    //     id: registeredUser.id,
    //     name: registeredUser.name,
    //     email: registeredUser.email,
    //     entries: registeredUser.entries,
    //     joined: registeredUser.joined
    // };
    // res.send(user);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) {
        return res.status(404).json('could not find user');
    }

});

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if (!found) {
        res.status(404).json('Could not find user with ID Provided');
    }


});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

// API DESIGN:
// 1: Login ->X
// 2: Register - POST => register user to DB and return registered user - X
// 4: Profile -> get => return user profile for the provided id - X
// 5: Image => PUT increase entries for the provided user - X