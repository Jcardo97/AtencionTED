const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


// constant for require
//const indexRoutes = require('./routes/index.js');
const tasksRoutes = require('./routes/tasks.js');
 
// settings
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//usefull BodyParser
app.use(bodyParser.json());

// middleweres
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
//app.use(indexRoutes);
app.use('/api',tasksRoutes);

//static files
app.use(express.static(path.join(__dirname, 'dist')));

//Se habilita el Puerto de escucha (3000)
app.listen(app.get('port'), () =>{
    console.log('Server on Port ', app.get('port'))
});