const express = require('express')
const router = express.Router()

const { db } = require('../lib/database')

// Serve job stories from API
router.get("/api/jobstories", (req, res) => {
    db
        .any(`SELECT j.id AS id, c.description AS context, m.description AS motivation, o.description AS outcome, p.id AS productId, p.title AS productTitle, (SELECT array_to_json(array_agg(row_to_json(usertypes))) FROM (SELECT u.id AS id, u.title AS title FROM usertypes AS u WHERE u.id = ANY (j.usertype_ids) ORDER BY u.title) usertypes) usertypes, (SELECT array_to_json(array_agg(row_to_json(forces))) FROM (SELECT f.id AS id, f.description AS description, f.direction AS direction FROM forces AS f WHERE f.id = ANY (j.forces_ids) ORDER BY f.direction) forces) forces FROM jobstories AS j, contexts AS c, motivations AS m, outcomes AS o, usertypes AS u, products AS p WHERE c.id=j.context_id AND m.id=j.motivation_id AND o.id=j.outcome_id AND u.id=j.usertype_ids[1] AND p.id=u.product_id;`)
        .then(data => {
            res.send(data);
            console.log('Success: Sent', data.length, 'job stories.');
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        });
});

module.exports = router
