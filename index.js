// implement your API here

// require the express npm module, needs to be added to the project using "yarn add" or "npm install"
const express = require('express');
const db = require('./data/db');



// creates an express application using the express module
const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json({ "error": "The users information could not be retrieved." });
        }
        )
})

server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        return;
    }
    db.insert({
        name,
        bio
    })
        .then(response => {
            res.status(201).json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database." });
            return;
        });
});


server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(user => {
            if (user.length === 0) {
                res.status(404).json({ errorMessage: "User with that id not found." });
                return;
            }
            res.json(user);
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "Error looking up user" });
        });
});


server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(response => {
            if (response === 0) {
                res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
                return;
            }
            res.json({ success: `User with id: ${id} removed from system` });
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The user could not be removed." });
            return;
        });
});


server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        return;
    }
    db.update(id, { name, bio })
        .then(response => {
            if (response == 0) {
                res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
                return;
            }
            db.findById(id)
                .then(user => {
                    if (user.length === 0) {
                        res.status(404).json({ errorMessage: "User with that id not found." });
                        return;
                    }
                    res.json(user);
                })
                .catch(error => {
                    res.status(500).json({ errorMessage: "Error looking up user." });
                });
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "Something bad happened in the database." });
            return;
        });
});





// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get('/', (req, res) => {
    // express will pass the request and response objects to this function
    // the .send() on the response object can be used to send a response to the client
    res.send('Hello World');
});


server.get('/hobbits', (req, res) => {
    // route handler code here
    const hobbits = [
        {
            id: 1,
            name: 'Samwise Gamgee',
        },
        {
            id: 2,
            name: 'Frodo Baggins',
        },
    ];

    res.status(200).json(hobbits);

});


// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(8000, () => console.log('API running on port 8000'));
