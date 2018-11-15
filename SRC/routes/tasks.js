var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Collection Name
var dbCollection = 'studentServices';
// Database Name
var dbName = 'appEstudiantes-db';
//string connection
const url = 'mongodb://localhost:27017';

    //
    //consulta a todos los datos
    //
    router.get('/tasks', (req, res, next) => {
        
        var result = [];

        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            
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

    //
    // QUery para hacer consultas "dinamicas"
    //

    router.get('/tasks/:_pNombre/:_pApellido/:_pCorreo/:_pFecha1/:_pFecha2/:_pServicio/:_pEstado', (req, res, next) => {

        //
        //Constants
        //
        var objConsulta = {
            Nombre: req.params._pNombre,
            Apellido: req.params._pApellido,
            Correo: req.params._pCorreo,
            Fecha1: req.params._pFecha1,
            Fecha2: req.params._pFecha2,
            Servicio: req.params._pServicio,
            Estado: req.params._pEstado
        };
        
        //
        //Begin a consult from DB
        //
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            //Variable for result the object
            var result;
            //Definition database
            const db = client.db(dbName);
            //Query Selection
            var queryConsulta = querySelection(objConsulta.Nombre, objConsulta.Apellido, objConsulta.Correo, objConsulta.Fecha1, objConsulta.Fecha2, objConsulta.Servicio,objConsulta.Estado);
            //interaction with database 
            db.collection(dbCollection).find(queryConsulta).toArray(function(err, docs) {
                if (err) throw err;
                result = JSON.stringify(docs);
                console.log(result);
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
            
            var result;

            const db = client.db(dbName);
            db.collection(dbCollection).insertOne(studentService, function(err, docs) {
                if (err) throw err;
                result = JSON.stringify(docs)
                res.send(docs);
                client.close();
            });
        });
    });

    //
    // metodo para eliminar datos
    //
    router.delete('/tasks/:id', (req, res, next) => {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            const db = client.db(dbName);
            var myquery = { _id: new mongo.ObjectId(req.params.id) };
            db.collection(dbCollection).deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    res.send(obj);
            });
            client.close();
        });  
    });

    //
    // metodo para actualizar datos
    //
    router.put('/task/:id', (req, res, next) => {
        
    });

    //
    //Method to validate date.
    //
    function querySelection(pNombre, pApellido, pCorreo, pFecha1, pFecha2, pServicio, pEstado){

        //Constants
        objConsulta = {
            Nombre: pNombre,
            Apellido: pApellido,
            Correo: pCorreo,
            Fecha1: pFecha1,
            Fecha2: pFecha2,
            Servicio: pServicio,
            Estado: pEstado,
        }
        var Query;

        //Funtions
        if(pFecha1 == 0 && pFecha2 == 0){
            Query = queryWithoutDate(objConsulta); // Generate query without dates
        } else {
            Query = queryWithDate(objConsulta); // Generate query with dates
        }
        console.log(Query);
        return Query;
    }


    ////////methods

    //
    //InsertMany
    //
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
            callback(result);
        });
    }

    //
    //Methods to Generate Query
    //

    //
    //Method to create query without dates
    //
    function queryWithoutDate(objConsulta){
        
        objQuery = {
            Nombre: objConsulta.Nombre,
            Apellido: objConsulta.Apellido,
            Correo: objConsulta.Correo,
            Servicio: objConsulta.Servicio,
            Estado: objConsulta.Estado
        }

        if(objQuery.Nombre == '&'){
            objQuery.Nombre = {$type:2};
          } else {
              objQuery.Nombre =  { $regex: objConsulta.Nombre };
          }
          if(objQuery.Apellido == '&'){
            objQuery.Apellido = {$type:2};
          } else {
            objQuery.Apellido =  { $regex: objConsulta.Apellido };
            }     
          if(objQuery.Correo == '&'){
            objQuery.Correo = {$type:2};
          }else {
            objQuery.Correo =  { $regex: objConsulta.Correo };
            }     
          if(objQuery.Servicio == '&'){
            objQuery.Servicio = {$type:2};
          } else {
            objQuery.Servicio =  { $regex: objConsulta.Servicio };
            }                   
          if(objQuery.Estado == '&'){
            objQuery.Estado = {$type:2};  
          } else {
            objQuery.Estado =  { $regex: objConsulta.Estado };
            }   
          Query = {
            Nombre: objQuery.Nombre,
            Apellido: objQuery.Apellido,
            Correo: objQuery.Correo,                
            Servicio: objQuery.Servicio,
            Estado: objQuery.Estado
          };

          return Query;
    }

    //
    //Method to create query with dates
    //
    function queryWithDate(objConsulta){
        
        objQuery = {
            Nombre: objConsulta.Nombre,
            Apellido: objConsulta.Apellido,
            Correo: objConsulta.Correo,
            Fecha1: objConsulta.Fecha1,
            Fecha2: objConsulta.Fecha2,
            Servicio: objConsulta.Servicio,
            Estado: objConsulta.Estado
        }

        if(objQuery.Nombre == '&'){
            objQuery.Nombre = {$type:2};
        } else {
            objQuery.Nombre =  { $regex: objQuery.Nombre };
        }
        if(objQuery.Apellido == '&'){
            objQuery.Apellido = {$type:2};
        } else {
            objQuery.Apellido =  { $regex: objQuery.Apellido };
        }      
        if(objQuery.Correo == '&'){
            objQuery.Correo = {$type:2};
        } else {
            objQuery.Correo =  { $regex: objQuery.Correo };
        }
        if(objQuery.Servicio == '&'){
            objQuery.Servicio = {$type:2};
        } else {
            objQuery.Servicio =  { $regex: objQuery.Servicio };
        }                  
        if(objQuery.Estado == '&'){
            objQuery.Estado = {$type:2};  
        } else {
            objQuery.Estado =  { $regex: objQuery.Estado };
        }
        if (objQuery.Fecha2 == 0){
            Query = {
                Nombre: objQuery.Nombre,
                Apellido: objQuery.Apellido,
                Correo: objQuery.Correo,
                Fecha: { $gte: parseInt(objQuery.Fecha1)},                
                Servicio: objQuery.Servicio,
                Estado: objQuery.Estado
            };
        } else if (objQuery.Fecha1 == 0){
            Query = {
                Nombre: objQuery.Nombre,
                Apellido: objQuery.Apellido,
                Correo: objQuery.Correo,
                Fecha: { $lte: parseInt(objQuery.Fecha2) },                
                Servicio: objQuery.Servicio,
                Estado: objQuery.Estado
            };
        }else {
            Query = {
                Nombre: objQuery.Nombre,
                Apellido: objQuery.Apellido,
                Correo: objQuery.Correo,
                Fecha: { $gte: parseInt(objQuery.Fecha1), $lte: parseInt(objQuery.Fecha2) },                
                Servicio: objQuery.Servicio,
                Estado: objQuery.Estado
            };
        }
        return Query;
    }
//////////////////////////////////
module.exports = router;