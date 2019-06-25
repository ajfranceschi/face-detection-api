const handleLogin = (req, res, database, bcrypt) => {
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
};

module.exports = {
    handleLogin: handleLogin
};