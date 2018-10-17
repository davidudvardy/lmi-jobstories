const express = require('express')
const router = express.Router()

const { db } = require('../lib/database')

// Serve job stories from API
router.get("/api/jobstories", (req, res) => {
    db
        .any(`SELECT c.description AS context, m.description AS motivation, o.description AS outcome, p.id AS product, j.usertype_ids AS userTypes FROM jobstories AS j, contexts AS c, motivations AS m, outcomes AS o, usertypes AS u, products AS p WHERE c.id=j.context_id AND m.id=j.motivation_id AND o.id=j.outcome_id AND u.id=j.usertype_ids[1] AND p.id=u.product_id;`)
        .then(data => {
            res.send(data);
            console.log('Sent', data.length, 'job stories.');
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        });
});

module.exports = router
