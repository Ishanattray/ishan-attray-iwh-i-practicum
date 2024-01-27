const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-acf984e9-177c-49e0-9e2c-f174c3128bab';

// ROUTE 1 - app.get route for the homepage to call custom object data
app.get('/', async (req, res) => {
    try {
        const customObjectEndpoint = 'https://api.hubapi.com/crm/v3/objects/2-22943385?limit=10&properties=name&properties=brand_name&properties=model&archived=false';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
        };

        const response = await axios.get(customObjectEndpoint, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Custom Object | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// ROUTE 2 - app.get route for rendering the HTML form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - app.post route for the route ("/update-cobj") that sends along the data captured by the HTML form
app.post('/create-cobj', async (req, res) => {
    try {
        const customObjectId = '2-22943385';
        const createCustomObjectEndpoint = `https://api.hubapi.com/crm/v3/objects/${customObjectId}`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };

        const data = {
            properties: {
                name: req.body.name,
                brand_name: req.body.brand_name,
                model: req.body.model
            }
        };

        const response = await axios.post(createCustomObjectEndpoint, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
