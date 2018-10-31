var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Collection Name
var dbCollection = 'studentServices';
// Database Name
var dbName = 'appEstudiantes-db';
//string connection
const url = 'mongodb://localhost:27017';

//consulta a todos los datos
router.get('/tasks', (req, res, next) => {
    
    var result = [];

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        
        var result; 

        const db = client.db(dbName);
        db.collection(dbCollection).find({}).toArray(function(err, docs) {
            if (err) throw err;
            
            result = JSON.stringify(docs);
            //console.log(result);
            res.send(result);
            client.close();
        });
    });
});

// QUery para hacer consultas "dinamicas"
router.get('/tasks/:_pNombre/:_pApellido/:_pCorreo/:_pFecha1/:_pFecha2/:_pServicio/:_pEstado', (req, res, next) => {

    var objConsulta = {
        Nombre: req.params._pNombre,
        Apellido: req.params._pApellido,
        Correo: req.params._pCorreo,
        Fecha1: req.params._pFecha1,
        Fecha2: req.params._pFecha2,
        Servicio: req.params._pServicio,
        Estado: req.params._pEstado
    };
    
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        //Variable for result the object
        var result;
        //Definition database
        const db = client.db(dbName);
        //Query Selection
        var queryConsulta = querySelection(objConsulta.Nombre, objConsulta.Apellido, objConsulta.Correo, objConsulta.Fecha1, objConsulta.Fecha2, objConsulta.Servicio,objConsulta.Estado);
        console.log("esta es la consulta que se está enviando:" + queryConsulta);
        //interaction with database 
        db.collection(dbCollection).find(queryConsulta).toArray(function(err, docs) {
            if (err) throw err;
            result = JSON.stringify(docs);
            res.send(result);
            client.close();
        });
    });
});

//
//Method to save information
//
router.post('/tasks', (req, res, next) => {
    const studentService = req.body;
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        
        var result;

        const db = client.db(dbName);
        db.collection(dbCollection).insertOne(studentService, function(err, docs) {
            if (err) throw err;
            console.log("1 document inserted");
            result = JSON.stringify(docs)
            res.send(docs);
            client.close();
          });
    });
});

// metodo para eliminar datos
    router.delete('/tasks/:id', (req, res, next) => {
        
    });

// metodo para actualizar datos
    router.put('/task/:id', (req, res, next) => {
        

    });

//
//Method to validate date.
//
function querySelection(pNombre, pApellido, pCorreo, pFecha1, pFecha2, pServicio, pEstado){

    //Constants
    var Query;
    if(pFecha1 == 0 && pFecha2 == 0){
        if(pNombre == 'a'){
            pNombre = {$type:2};
          }
          if(pApellido == 'a'){
            pApellido = {$type:2};
          }      
          if(pCorreo == 'a'){
            pCorreo = {$type:2};
          }     
          if(pServicio == 'a'){
            pServicio = {$type:2};
          }                    
          if(pEstado == 'a'){
            pEstado = {$type:2};  
          }    
          Query = {
            Nombre: pNombre,
            Apellido: pApellido,
            Correo: pCorreo,                
            Servicio: pServicio,
            Estado: pEstado
          };
    } else {
        if(pNombre == 'a'){
            pNombre = {$type:2};
          }
          if(pApellido == 'a'){
            pApellido = {$type:2};
          }      
          if(pCorreo == 'a'){
            pCorreo = {$type:2};
          }     
          if(pServicio == 'a'){
            pServicio = {$type:2};
          }                    
          if(pEstado == 'a'){
            pEstado = {$type:2};  
          }
          console.log("Esta es la fecha2: " + pFecha2); 
          if (pFecha2 == 0){
            Query = {
                Nombre: pNombre,
                Apellido: pApellido,
                Correo: pCorreo,
                Fecha: { $gte: parseInt(pFecha1)},                
                Servicio: pServicio,
                Estado: pEstado
            };
            Console.log(Query);  
          } else if (pFecha1 == 0){
              Query = {
                Nombre: pNombre,
                Apellido: pApellido,
                Correo: pCorreo,
                Fecha: { $lte: parseInt(pFecha2) },                
                Servicio: pServicio,
                Estado: pEstado
              };
          }
          Query = {
            Nombre: pNombre,
            Apellido: pApellido,
            Correo: pCorreo,
            Fecha: { $gte: parseInt(pFecha1), $lte: parseInt(pFecha2) },                
            Servicio: pServicio,
            Estado: pEstado
          };
    }
    
    return Query;
}

////////methods

//InsertMany
const insertDocuments = function(db, item, callback) {
    // Call the collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
            item
    ], function(err, result) {
        assert.equal(null, err);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 1 documents into the collection");
        callback(result);
    });
}


//////////////////////////////////
module.exports = router;