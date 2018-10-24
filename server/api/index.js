const express = require('express')
const router = express.Router()

router.use(require('./categories'))
router.use(require('./jobstories'))
router.use(require('./jobstory-update'))
router.use(require('./jobstory-add'))

module.exports = router
