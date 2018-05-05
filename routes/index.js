var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('twitter_search');
  collection.find({},{},function(e,docs){
    res.render('tweets', { 
      "tweets" : docs 
    });
  });
});

router.get('/tweets', function(req, res) {
  res.render('tweets', { title: 'Tweets' });
});

router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

router.get('/fichiers', function(req, res) {
  res.render('fichiers', { title: 'Fichiers' });
});

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
      res.render('userlist', {
          "userlist" : docs
      });
  });
});

router.get('/twitter', function(req, res) {
  var db = req.db;
  var collection = db.get('twitter_search');
  collection.find({},{},function(e,docs){
      res.render('twitter', {
          "tweets" : docs
      });
  });
});





module.exports = router;
