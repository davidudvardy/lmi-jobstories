const express = require('express')
const router = express.Router()
const { db } = require('../lib/database')

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// Update job story with jobId passed in path
router.put('/api/jobstory-update/:jobId', (req, res) => {
    db
        .task(t => {
            return t.oneOrNone(`SELECT context_id, motivation_id, outcome_id FROM jobstories WHERE id = $1;`, req.params.jobId)
                .then(data => {
                    if (data) {
                        return t.multi(`UPDATE contexts SET description=$2 WHERE id = $1 RETURNING id,description; UPDATE motivations SET description=$4 WHERE id = $3 RETURNING id,description; UPDATE outcomes SET description=$6 WHERE id = $5 RETURNING id,description;`, [
                            data.context_id,
                            req.body.context,
                            data.motivation_id,
                            req.body.motivation,
                            data.outcome_id,
                            req.body.outcome
                        ]);
                    }
                    return []; // data not found, so no events
                });
        })
        .then(data => {
            res.send(data);
            console.log('Updated', data.length, 'tables with data:', data);
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        });
});


module.exports = router