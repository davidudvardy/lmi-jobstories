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
            return t.oneOrNone(`SELECT context_id, motivation_id, outcome_id, forces_ids FROM jobstories WHERE id = $1;`, req.params.jobId)
                .then(data => {
                    if (data) {
                        // Job story exists, so we are updating it's referenced items
                        // TODO: remove wired sample UPDATE request to update force #3 !!
                        // TODO: construct SQL to include all force updates derived from req.body.forces !!
                        return t.multi(`UPDATE contexts SET description=$2 WHERE id = $1 RETURNING id,description; UPDATE motivations SET description=$4 WHERE id = $3 RETURNING id,description; UPDATE outcomes SET description=$6 WHERE id = $5 RETURNING id,description; UPDATE forces SET description=$8 WHERE id = $7;`, [
                            data.context_id,
                            req.body.context,
                            data.motivation_id,
                            req.body.motivation,
                            data.outcome_id,
                            req.body.outcome,
                            req.body.forces[0].id,
                            req.body.forces[0].description
                        ])
                    } else {
                        // Job story not found, so we are adding it
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
                                ])
                            }
                            return [] // data not found, so no events
                        })
                    }
                })
        })
        .then(data => {
            res.send(data)
            console.log('Updated', data.length, 'tables with data:', data)
            console.log('Forces data sent:', req.body.forces);
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        })
})


module.exports = router