const express = require('express')
const router = express.Router()

router.use(require('./categories'))
router.use(require('./jobstories'))

module.exports = router
