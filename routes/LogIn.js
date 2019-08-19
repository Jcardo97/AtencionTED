var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Collection Name
var dbCollection = 'userInformation';
// Database Name
var dbName = 'appEstudiantesVE-db';
//string connection
const url = 'mongodb://localhost:27017';

router.post('/', (req, res, next) => {
    const userInformation = req.body;
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err); 
        const db = client.db(dbName);
        db.collection(dbCollection).findOne({ Usuario: userInformation.User}, function(err, user) {
            if(user === null){
               res.send(false);
            }else if (user.Usuario === userInformation.User && user.Contraseña === userInformation.Password){
              res.send(user);
          } else {
            res.send(false);
          }
        });
        client.close();
        
    });
});

// se exporta el objeto con todas las direcciones
module.exports = router;