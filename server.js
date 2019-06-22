const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const saltRounds = 10;

const database = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'afrances',
        password: '',
        database: 'smart-brain'
    }
});



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
    return database.select("*")
        .from('users')
        .then(data => res.json(data));
});

// PRAGMA MARK: -Login

app.post('/login', (req, res) => {
    database('login')
        .select('email', 'hash')
        .where('email', req.body.email)
        .then(loginUser => {
            if (bcrypt.compareSync(req.body.password,loginUser[0].hash)) {
                return database('users')
                    .select('*')
                    .where('email', loginUser[0].email)
                    .then(user => res.json(user[0]))
                    .catch(error => res.json("error logging in"))
            } else {
                res.status(400).json('Incorrect credentials');
            }
        })
        .catch(error => res.json('Incorrect credentials'));
});

// ####### REGISTER ##########

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;

    // convert password to hash
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // insert into login and users using transaction
    database.transaction(trx => {
        trx('login')
            .insert({
                email: email,
                hash: hash
            })
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(error => res.status(400).json('Error registering user'));

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