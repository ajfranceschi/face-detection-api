const saltRounds = 10;

const handleRegister = (req, res, database, bcrypt) => {
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
    };

module.exports = {
    handleRegister: handleRegister
};