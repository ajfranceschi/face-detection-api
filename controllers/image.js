const handleImage = (req, res, database) => {
    const {id} = req.body;

    return database('users')
        .where('id', '=', id)
        .returning('entries')
        .increment('entries', 1)
        .then(entries => {
            if (entries.length > 0) {
                res.json(entries[0]);
            } else {
                res.status(400).json("couldn't find user");
            }
        })
        .catch(error => res.status(400).json('could not find user'));
};

module.exports = {handleImage};
