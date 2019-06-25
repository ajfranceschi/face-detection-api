const handleLogin = (req, res, database, bcrypt) => {
    const {email, password} = req.body;
    console.log(email);
    // Validation:
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    database('login')
        .select('email', 'hash')
        .where('email', email)
        .then(loginUser => {
            if (bcrypt.compareSync(password, loginUser[0].hash)) {
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