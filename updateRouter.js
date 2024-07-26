const express = require('express');
const router = express.Router();


router.get('/update', (req, res) => {
    res.sendFile(__dirname + '/update.html');
});

module.exports = router;