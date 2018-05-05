var express = require('express');
var router = express.Router();


router.get('/fichiers', function(req, res) {
    var db = req.db;
    var collection = db.get('twitter_search');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


module.exports = router;