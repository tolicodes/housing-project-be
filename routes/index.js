const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/borrower', require('./borrower'));

module.exports = router;