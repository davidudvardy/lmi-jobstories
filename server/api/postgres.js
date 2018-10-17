const express = require('express')
const router = express.Router()

const { db } = require('../lib/database')

router.get('/api/postgres', (req, res, next) => {
  db
    .any('select * from contexts')
    .then(data => {
      res.json(`${req.path} fetched ${JSON.stringify(data)} from the database`)
    })
    .catch(next)
})

module.exports = router
