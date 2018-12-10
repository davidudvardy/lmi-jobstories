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
                    let query = ""
                    let values = []
                    if (data) {
                        // Job story exists, so we are updating it's referenced items
                        query = `UPDATE contexts SET description=$2 WHERE id=$1 RETURNING id,description; ` + 
                                `UPDATE motivations SET description=$4 WHERE id=$3 RETURNING id,description; ` + 
                                `UPDATE outcomes SET description=$6 WHERE id=$5 RETURNING id,description; `
                        values = [
                            data.context_id,
                            req.body.context,
                            data.motivation_id,
                            req.body.motivation,
                            data.outcome_id,
                            req.body.outcome
                        ]
                        req.body.forces.map(force => (
                                query += "UPDATE forces SET description='" + force.description.replace(/'/g, "''") + "' WHERE id=" + force.id + " RETURNING id,description; "
                            )
                        )
                        return t.multi(query, values)
                    } else {
                        // Job story not found, so we are adding it
                        // First we add it's components
                        query = `INSERT INTO contexts(description) VALUES($1) RETURNING id; ` + 
                                `INSERT INTO motivations(description) VALUES($2) RETURNING id; ` + 
                                `INSERT INTO outcomes(description) VALUES($3) RETURNING id; `
                        values = [
                            req.body.context,
                            req.body.motivation,
                            req.body.outcome
                        ]
                        req.body.forces.map(force => (
                                query += "INSERT INTO forces(description, direction) " + 
                                         "VALUES('" + force.description.replace(/'/g, "''") + "', '" + force.direction + "') " + 
                                         "RETURNING id; "
                            )
                        )
                        return t.multi(query, values)
                            // Then we add the job story itself with the newly added components' ids as refs
                            .then(data => {
                                if (data) {
                                    // First 3 ids are for context, motivation and outcome respectively. Everything after it is a force
                                    let cards = data.slice(0,3)
                                    let forces = []
                                    data.slice(3).map(force => (
                                        forces.push(force[0].id)
                                    ))

                                    query = `INSERT INTO jobstories(context_id, motivation_id, outcome_id, usertype_ids, forces_ids) ` + 
                                            `VALUES($1, $2, $3, '{bold360-end-user}', $4) ` + 
                                            `RETURNING id;`
                                    values = [
                                        cards[0][0].id,
                                        cards[1][0].id,
                                        cards[2][0].id,
                                        "{" + forces.join() + "}"
                                    ]
                                    return t.one(query, values)
                                }
                                return [] // data not found, so no events
                            })
                    }
                })
        })
        .then(data => {
            res.send(data)
            console.log('Updated', data.length, 'tables with data:', data)
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        })
})


module.exports = router