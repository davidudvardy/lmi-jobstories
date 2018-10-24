const express = require('express')
const router = express.Router()
const { db } = require('../lib/database')

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// Create job story with POST data
router.post('/api/jobstory-add', (req, res) => {
    db
        .task(t => {
            return t.multi(`INSERT INTO contexts(description) VALUES($1) RETURNING id; INSERT INTO motivations(description) VALUES($2) RETURNING id; INSERT INTO outcomes(description) VALUES($3) RETURNING id;`, [
                req.body.context,
                req.body.motivation,
                req.body.outcome
            ])
                .then(data => {
                    if (data) {
                        return t.one(`INSERT INTO jobstories(context_id, motivation_id, outcome_id, usertype_ids) VALUES($1, $2, $3, '{bold360-end-user}') RETURNING id;`, [
                            data[0][0].id,
                            data[1][0].id,
                            data[2][0].id
                        ]);
                    }
                    return []; // data not found, so no events
                });
        })
        .then(data => {
            res.send(data);
            console.log('Added new job story at ID #', data.id);
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        });
});


module.exports = router