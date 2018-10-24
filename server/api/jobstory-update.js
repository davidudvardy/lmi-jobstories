const express = require('express')
const router = express.Router()
const { db } = require('../lib/database')

var bodyParser = require('body-parser')
router.use(bodyParser.json())

// Serve job stories from API
// Make sure that we only respond to /api/jobstory-update/123 like paths, with no '/' at the end
router.put('/api/jobstory-update/:jobId', (req, res) => {
    db
        .task(t => {
            return t.oneOrNone(`SELECT context_id, motivation_id, outcome_id FROM jobstories WHERE id = $1;`, req.params.jobId)
                .then(data => {
                    if (data) {
                        return t.multi(`UPDATE contexts SET description=$2 WHERE id = $1; UPDATE motivations SET description=$4 WHERE id = $3; UPDATE outcomes SET description=$6 WHERE id = $5;`, [
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
            console.log('Response:', data);
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        });
});


module.exports = router