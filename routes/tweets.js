var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

router.get('/t/:type/:nbt/:user', function (req, res) {
    var db = req.db;
    var collection = db.get('twitter_search');

    var nbt = parseInt(req.params.nbt);
    var size = {};
    size['size'] = nbt;
    var match = {};
    var uti = "utilisateurs." + req.params.user;
    match[uti] = {};
    match[uti] = { $exists: false };

    collection.aggregate([
        { $match: match },
        { $sample: { size: nbt } }
    ], function (e, docs) {
        res.json(docs);
    })

});

router.get('/getOneTweet/:user', function (req, res) {
    var db = req.db;
    var collection = db.get('twitter_search');

    var match = {};
    var uti = "utilisateurs." + req.params.user;
    match[uti] = {};
    match[uti] = { $exists: false };

    collection.aggregate([
        { $match: match },
        { $sample: { size: 1 } }
    ], function (e, docs) {
        res.json(docs);
    })

});

router.get('/res', function (req, res) {

    var db = req.db;
    var collection = db.get('twitter_search');

    collection.aggregate([
        { $sort: { evaluations: -1 } }
    ], function (e, docs) {
        res.send(docs);
    });

});

router.get('/alltweets', function (req, res) {

    var db = req.db;
    var collection = db.get('twitter_search');

    collection.aggregate([
        { $sort: { evaluations: -1 } }
    ], function (e, docs) {
        res.send(docs);
    });

});


router.get('/signales', function (req, res) {

    var db = req.db;
    var collection = db.get('signales');

    collection.aggregate([
        { $sort: { _id: -1 } }
    ], function (e, docs) {
        res.send(docs);
    });

});

router.get('/mesevals/:user', function (req, res) {

    var db = req.db;
    var collection = db.get('twitter_search');

    var match = {};
    var uti = "utilisateurs." + req.params.user;
    match[uti] = {};
    match[uti] = { $exists: true };

    collection.aggregate({ $match: match }, function (e, docs) {
        console.log(docs);
        res.json(docs);
    });

})


router.get('/getlog', function (req, res) {
    var db = req.db;
    var collection = db.get('log');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/count', function (req, res) {

});


router.get('/keywords', function (req, res) {
    var db = req.db;
    var collection = db.get('keywords');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.post('/addkeywords', function (req, res) {
    var db = req.db;
    var collection = db.get('keywords');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.post('/addlog', function (req, res) {
    var db = req.db;
    var collection = db.get('log');
    collection.insert(req.body, function (err) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


router.post('/alert/:id_str/', function (req, res) {
    var db = req.db;
    var collection = db.get('twitter_search');
    var signales = db.get('signales');

    collection.update({ id_str: req.params.id_str }, { $inc: { signalements: +1 } });

    collection.findOne({ id_str: req.params.id_str }, function (err, tweet) {
        if (tweet)
            if (tweet.signalements > 1) {
                console.log('Signalement de tweet');
                signales.insert(tweet);
                collection.remove({ id_str: req.params.id_str });
            }
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });

})


router.post('/recuperer/:id_str/', function (req, res) {
    var db = req.db;
    var collection = db.get('twitter_search');
    var signales = db.get('signales');

    // signales.update({ id_str: req.params.id_str }, { $inc: { signalements: -1 } });

    signales.findOne({ id_str: req.params.id_str }, function (err, tweet) {
        if (tweet)
            console.log('Récupération de tweet');
        collection.insert(tweet);
        signales.remove({ id_str: req.params.id_str });
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });

})

router.post('/changenote/:id/:user/:pos/:dec', function (req, res) {
    var db = req.db;
    var id = req.params.id;
    var note = req.params.pos;

    var collection = db.collection('twitter_search');

    var user = {};
    user["utilisateurs." + req.params.user] = note;
    var update = {};

    update = { $set: user };
    collection.update(
        { "id_str": id },
        update, function (err) {
            if (!err) {
                if (req.params.dec === "true") {
                    collection.update({ "id_str": id }, { $inc: { "evaluations": +1 } });
                    db.collection('utilisateurs').update(
                        { "pseudo": req.params.user },
                        { $inc: { "evaluations_restantes": -1 } }, function (err) {

                        });
                }




                // Remplace la fonction valide -- Valide ou non le tweet
                collection.findOne({ id_str: id }, function (err, tweet) {
                    if (tweet && (tweet.evaluations > 2)) {


                console.log('Validation..');

                var positif = 0, neutre = 0, negatif = 0;
                var uti = tweet.utilisateurs;

                Object.keys(tweet.utilisateurs).forEach(function (key) {
                    if (uti[key] === 'positif') {
                        positif++;
                    } else if (uti[key] === 'neutre') {
                        neutre++;
                    } else if (uti[key] === 'negatif') {
                        negatif++;
                    }
                });

                if (Math.max(positif, neutre, negatif) > ((positif + negatif + neutre) - Math.max(positif, neutre, negatif) - Math.min(positif,negatif,neutre))) {
                    update = { $set: { valide: true } };
                    console.log('Tweet valide');

                }
                else {
                    update = { $set: { valide: false } };
                    console.log('Tweet non valide');

                }

                collection.update({ id_str: id }, update);

            }});

            }

            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });


});





router.post('/connexion', function (req, res) {

    var db = req.db;
    var userName = req.body.pseudo;


    console.log(userName);

    var collection = db.get('utilisateurs');


    collection.findOne({ 'pseudo': userName }, function (err, user) {
        if (user) {

            bcrypt.compare(req.body.password, user.password, function (err, res2) {
                if (err)
                    res.send({ msg: "erreur" });
                else if (res2) {
                    console.log('Connexion de ' + userName);
                    res.send(user);
                }
                else {
                    res.send({ msg: "Mot de passe non valide" });
                }
            });


        }
        else {
            console.log("Erreur: " + err + userName);
            res.send({ msg: "Utilisateur non trouvé" });
        }
        return user;
        // res.send(
        //     (err === null) ? { msg: '' } : { msg: err }
        // );

    });


});


router.post('/adduser', function (req, res) {

    var db = req.db;
    var collection = db.get('utilisateurs');

    var userName = req.body.pseudo;
    var userEmail = req.body.email;
    var userPassword = req.body.password;

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return err;

        bcrypt.hash(userPassword, salt, function (err, hash) {
            if (err) return err;
            userPassword = hash;
            console.log(hash);

            collection.findOne({ 'pseudo': userName }, function (err, user) {
                if (user) {
                    res.send({ msg: 500 });
                }
                else {
                    collection.insert({
                        "pseudo": userName,
                        "email": userEmail,
                        "password": userPassword,
                        "evaluations_restantes": 80,
                        "acces_resultats": false,
                        "admin": false
                    }, function (err) {
                        if (err)
                            res.send({ msg: err });
                        else {
                            collection.findOne({ 'pseudo': userName }, function (err, user) {
                                if (!err) {
                                    res.send(user);
                                }
                            });
                        }
                    });
                }
            });






        });
    });

    console.log(userPassword);




});


router.get('/reload', function (req, res) {
    var myPythonScriptPath = 'public/javascripts/word.py';

    var PythonShell = require('python-shell');
    var pyshell = new PythonShell(myPythonScriptPath);

    pyshell.on('message', function (message) {
        console.log(message);
    });

    pyshell.end(function (err) {
        if (err)
            throw err;
        else
            res.send({ msg: '' });


        console.log('finished');
    });
});


router.get('/correction/:typet', function (req, res) {
    var PythonShell = require('python-shell');

    var options = {
        args: [req.params.typet]
    };
    PythonShell.run('public/javascripts/correction.py', options, function (err, results) {
        if (err) throw err;
        else res.send({ msg: '' });
        console.log('results: %j', results);
    });

});


router.get('/getnewtweets/:typet', function (req, res) {
    var PythonShell = require('python-shell');

    var options = {
        args: [req.params.typet]
    };
    PythonShell.run('public/javascripts/streaming_API.py', options, function (err, results) {
        if (err)
            throw err;
        console.log('results: %j', results);
    });
    res.send({ msg: '' });

});


router.delete('/deletet/:type/:id', function (req, res) {

    var db = req.db;

    var signales = db.get('signales');

    var collection;
    collection = db.get('twitter_search');

    var tweetToDelete = req.params.id;

    collection.findOne({ '_id': tweetToDelete }, function (err, tweet) {
        if (tweet) {
            signales.insert(tweet);
            collection.remove({ '_id': tweetToDelete });
        }
        res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err })
    })

});

router.delete('/supplog', function (req, res) {

    var db = req.db;
    var collection = db.get('log');
    collection.remove();
    res.send({ msg: '' });

});

router.delete('/deleteall/:typet/:utilisateur', function (req, res) {

    var date = new Date();
    var h = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    console.log('Supp de ' + req.params.utilisateur + ' à ' + h + ' : ' + min + ' : ' + sec);

    var db = req.db;
    if (req.params.typet === 't') {
        var collection = db.get('twitter_search');
    } else if (req.params.typet === 'tp') {
        var collection = db.get('tweets_positifs');
    } else if (req.params.typet === 'tn') {
        var collection = db.get('tweets_negatifs');
    } else if (req.params.typet === 'tneu') {
        var collection = db.get('tweets_neutres');
    }
    collection.remove();
    res.send({ msg: '' });
});


router.delete('/removekeywords', function (req, res) {
    var db = req.db;
    var collection = db.get('keywords');
    collection.remove();
});


module.exports = router;