const handleProfileGet = (req, res, database) => {
    const { id } = req.params;

    return database('users')
        .select('*')
        .where('id', id)
        .then(user => {
            if (user.length > 0) {
                res.json(user[0]);
            } else {
                res.status(400).json('Could not find user.')
            }

        })
        .catch(error => res.status(404).json('could not find user'));
};

module.exports = {
    handleProfileGet : handleProfileGet
};