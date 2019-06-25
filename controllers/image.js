const clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '9b21623083d34be8a4a578486c11241a'
});

const handleApiCall = (req, res) => {
    return app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(error => res.status(400).json('Error using Clarifai API'));
};

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

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};
