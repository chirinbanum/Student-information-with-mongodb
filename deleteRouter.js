const express = require('express');

const router = express.Router();


router.get('/delete', (req, res) => {
    res.sendFile(__dirname + '/delete.html');
});

module.exports = router;
