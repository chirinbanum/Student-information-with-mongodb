const express = require('express');
const router = express.Router();

router.get('/insert', (req, res) => {
    try {
        res.sendFile(__dirname + '/index.html');
    } catch (error) {
        console.error('Error sending index.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;