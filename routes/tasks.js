var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Collection Name
var dbCollection = 'studentServices';
// Database Name
var dbName = 'appEstudiantesVE-db';
//string connection
const url = 'mongodb://localhost:27017';

    //
    /* Método para consultar todos los datos */
    //
    router.get('/tasks', (req, res, next) => {
        
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
    /* Método para consultar datos por ID */
    //
    router.get('/tasks/:id', (req, res, next) => {

        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            var result; 
            const db = client.db(dbName);
            var myquery = { _id: new mongo.ObjectId(req.params.id) };
            db.collection(dbCollection).find(myquery).toArray(function(err, docs) {
                if (err) throw err;
                result = JSON.stringify(docs);
                res.send(result);
                client.close();
            });
        });
    });

    //
    /* Consulta datos dinámicos */
    //
    router.get('/tasks/:_pCedula/:_pNombre/:_pApellido/:_pCorreo/:_pFecha1/:_pFecha2/:_pServicio/:_pEstado/:_pCuatrimestre/:_pCarrera', (req, res, next) => {

        var objConsulta = {
            Cedula: req.params._pCedula,
            Nombre: req.params._pNombre,
            Apellido: req.params._pApellido,
            Correo: req.params._pCorreo,
            Fecha1: req.params._pFecha1,
            Fecha2: req.params._pFecha2,
            Servicio: req.params._pServicio,
            Estado: req.params._pEstado,
            Cuatrimestre: req.params._pCuatrimestre,
            Carrera: req.params._pCarrera
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
            var queryConsulta = querySelection(objConsulta.Cedula, objConsulta.Nombre, objConsulta.Apellido, objConsulta.Correo, objConsulta.Fecha1, objConsulta.Fecha2, objConsulta.Servicio,objConsulta.Estado, objConsulta.Cuatrimestre, objConsulta.Carrera);
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
    /* Método para salvar datos */
    //
    router.post('/tasks', (req, res, next) => {
        const studentService = {
            CaseId: "",
            User: req.body.userName,
            Cedula: req.body.Cedula,
            Nombre: req.body.Nombre,
            Apellido: req.body.Apellido,
            Correo: req.body.Correo,
            Telefono: req.body.Telefono,
            Fecha: req.body.Fecha,
            Servicio: req.body.Servicio,
            Estado: req.body.Estado,
            MetodoSolicitud: req.body.MetodoSolicitud,
            Detalle: req.body.Detalle,
            Campus: req.body.Campus,
            Carrera: req.body.Carrera,
            Cuatrimestre: req.body.Cuatrimestre 
        };
        var vAuxService = identifyCase(studentService.Servicio);
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            const db = client.db(dbName);
            MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                var db = client.db(dbName);
                // Generate speacial case code
                db.collection("atentionControl").findAndModify({ _id: vAuxService },[],{$inc:{sequence_value:1}},{ new: true } ,function(err, obj) {
                    if (err) throw err;
                    studentService.CaseId = obj.value._id + "-" +obj.value.sequence_value; 
                    // save the case
                    db.collection(dbCollection).insertOne(studentService, function(err, docs) {
                        if (err) throw err;
                        res.send(docs);
                        client.close();
                    });
                });
            }); 
        });
    });

    //
    /* Método para eliminar datos */
    //
    router.delete('/tasks/:id', (req, res, next) => {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            var db = client.db(dbName);
            var myquery = { _id: new mongo.ObjectId(req.params.id) };
            db.collection(dbCollection).deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    res.send(obj);
            });
            client.close();
        });  
    });

    //
    /* Método para actualizar datos */
    //
    router.put('/tasks/:_id', (req, res, next) => {
        var studentService = req.body;
        MongoClient.connect(url, function(err, client) {
            if (err) throw err;
            var db = client.db(dbName);
            var myquery = { _id: new mongo.ObjectId(req.params._id) };
            var newvalues = {
                                        Nombre: studentService.name, 
                                        Apellido: studentService.lastname, 
                                        Correo: studentService.correo, 
                                        Servicio: studentService.servicio,
                                        Estado: studentService.estado,
                                        Detalle: studentService.detalle,
                                        Campus: studentService.campus,
                                        MetodoSolicitud: studentService.metodoSolicitud,
                                        Cuatrimestre: studentService.cuatrimestre,
                                        Carrera: studentService.carrera
                            }; 
            db.collection(dbCollection).updateMany(myquery, {$set: newvalues}, function(err, obj) {
              if (err) throw err;  
              res.send(obj)
              client.close();
            });
          });
    });

    //
    /* Método para validar fechas */
    //
    function querySelection(pCedula, pNombre, pApellido, pCorreo, pFecha1, pFecha2, pServicio, pEstado, pCuatrimestre, pCarrera){

        //Constants
        objConsulta = {
            Cedula: pCedula,
            Nombre: pNombre,
            Apellido: pApellido,
            Correo: pCorreo,
            Fecha1: pFecha1,
            Fecha2: pFecha2,
            Servicio: pServicio,
            Estado: pEstado,
            Cuatrimestre: pCuatrimestre,
            Carrera: pCarrera
        }
        var Query;

        //Funtions
        if(pFecha1 == 0 && pFecha2 == 0){
            Query = queryWithoutDate(objConsulta); // Generate query without dates
        } else {
            Query = queryWithDate(objConsulta); // Generate query with dates
        }
        return Query;
    }

    //
    /* Método para generar copnsultas sin fechas */
    //
    function queryWithoutDate(objConsulta){
        
        objQuery = {
            Cedula: objConsulta.Cedula,
            Nombre: objConsulta.Nombre,
            Apellido: objConsulta.Apellido,
            Correo: objConsulta.Correo,
            Servicio: objConsulta.Servicio,
            Estado: objConsulta.Estado,
            Carrera: objConsulta.Carrera,
            Cuatrimestre: objConsulta.Cuatrimestre
        }
        if(objQuery.Cedula == '&'){
            objQuery.Cedula = {$type:2};
          } else {
              objQuery.Cedula =  { $regex: objConsulta.Cedula };
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
          if(objQuery.Cuatrimestre == '&'){
            objQuery.Cuatrimestre = {$type:2};  
          } else {
            objQuery.Cuatrimestre =  { $regex: objConsulta.Cuatrimestre };
            }
          if(objQuery.Carrera == '&'){
            objQuery.Carrera = {$type:2};  
          } else {
            objQuery.Carrera =  { $regex: objConsulta.Carrera };
            }    

          Query = {
            Cedula: objQuery.Cedula,  
            Nombre: objQuery.Nombre,
            Apellido: objQuery.Apellido,
            Correo: objQuery.Correo,                
            Servicio: objQuery.Servicio,
            Estado: objQuery.Estado,
            Cuatrimestre: objQuery.Cuatrimestre,
            Carrera: objQuery.Carrera
          };

          return Query;
    }

    //
    /* Metodo para generar consulta con fechas */
    //
    function queryWithDate(objConsulta){
        
        objQuery = {
            Cedula: objConsulta.Cedula,
            Nombre: objConsulta.Nombre,
            Apellido: objConsulta.Apellido,
            Correo: objConsulta.Correo,
            Fecha1: objConsulta.Fecha1,
            Fecha2: objConsulta.Fecha2,
            Servicio: objConsulta.Servicio,
            Estado: objConsulta.Estado,
            Cuatrimestre: objConsulta.Cuatrimestre,
            Carrera: objConsulta.Carrera
        }
        if(objQuery.Cedula == '&'){
            objQuery.Cedula = {$type:2};
        } else {
            objQuery.Cedula =  { $regex: objQuery.Cedula };
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
        if(objQuery.Cuatrimestre == '&'){
            objQuery.Cuatrimestre = {$type:2};  
        } else {
            objQuery.Cuatrimestre =  { $regex: objQuery.Cuatrimestre };
        }
        if(objQuery.Carrera == '&'){
            objQuery.Carrera = {$type:2};  
        } else {
            objQuery.Carrera =  { $regex: objQuery.Carrera };
        }
        if (objQuery.Fecha2 == 0){
            Query = {
                Cedula: objQuery.Cedula,
                Nombre: objQuery.Nombre,
                Apellido: objQuery.Apellido,
                Correo: objQuery.Correo,
                Fecha: { $gte: parseInt(objQuery.Fecha1)},                
                Servicio: objQuery.Servicio,
                Estado: objQuery.Estado,
                Cuatrimestre: objQuery.Cuatrimestre,
                Carrera: objQuery.Carrera
            };
        } else if (objQuery.Fecha1 == 0){
            Query = {
                Cedula: objQuery.Cedula,
                Nombre: objQuery.Nombre,
                Apellido: objQuery.Apellido,
                Correo: objQuery.Correo,
                Fecha: { $lte: parseInt(objQuery.Fecha2) },                
                Servicio: objQuery.Servicio,
                Estado: objQuery.Estado,
                Cuatrimestre: objQuery.Cuatrimestre,
                Carrera: objQuery.Carrera
            };
        }else {
            Query = {
                Cedula: objQuery.Cedula,
                Nombre: objQuery.Nombre,
                Apellido: objQuery.Apellido,
                Correo: objQuery.Correo,
                Fecha: { $gte: parseInt(objQuery.Fecha1), $lte: parseInt(objQuery.Fecha2) },                
                Servicio: objQuery.Servicio,
                Estado: objQuery.Estado,
                Cuatrimestre: objQuery.Cuatrimestre,
                Carrera: objQuery.Carrera
            };
        }
        return Query;
    }

    //
    /* Método para generar código de caso */
    //
    function caseCodeGenerator(identifier)
    {
        var result = ""
        MongoClient.connect(url, function(err, client) {
            if (err) throw err;
            var db = client.db(dbName);
            db.collection("atentionControl").findAndModify({ _id: identifier },[],{$inc:{sequence_value:1}},{ new: true } ,function(err, obj) {
                if (err) throw err;
                console.log(obj.value);
                result = obj.value._id + "-" +obj.value.sequence_value; 
                
              });
        });
    }

    //
    /* Método para identificar el tipo de atención */
    //
    function identifyCase(caseIdentifier)
    {
        var vResult = ""
        if(caseIdentifier == "ADECUACIONES"){
            vResult = "ADE"
        } else if(caseIdentifier == "EXONERACIONES")
        {
            vResult= "EXO";
        }else if(caseIdentifier == "CONVIVENCIA")
        {
            vResult = "CON";
        } else if(caseIdentifier == "CASOS ESPECIALES") 
        {
            vResult = "CES";
        } else if(caseIdentifier == "ACOSO U HOSTIGAMIENTO SEXUAL")
        {
            vResult = "AHS";
        } else {
            vResult = "OTR";
        }
        return vResult;
    }

    //
    /* InsertMany */
    //
    /*
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
    */

//////////////////////////////////
module.exports = router;