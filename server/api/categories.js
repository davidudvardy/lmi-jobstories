const express = require('express')
const router = express.Router()

const { db } = require('../lib/database')

// Serve categories from API
router.get("/api/categories", (req, res) => {
    db
        .any(`SELECT * FROM (SELECT p.id AS key, p.title, (SELECT array_to_json(array_agg(row_to_json(usertypes))) FROM (SELECT u.id AS key, u.title FROM usertypes AS u WHERE u.product_id=p.id) usertypes) as usertypes FROM products AS p) product_usertypes;`)
        .then(data => {
            res.send(data);
            console.log('Sent', data.length, 'product categories.');
        })
        .catch(function (err) {
            res.json(`Couldn't serve ${req.path} request. Error message: ${JSON.stringify(err)}`)
        });
});

module.exports = router
