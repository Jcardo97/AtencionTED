const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


// constant for require
//const indexRoutes = require('./routes/index.js');
const tasksRoutes = require('./routes/tasks.js');
const LogInRoutes = require('./routes/LogIn.js');
 
// settings
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3001);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//usefull BodyParser
app.use(bodyParser.json());

// middleweres
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use('/',express.static('client', {redirect: false}));
app.use('/api',tasksRoutes);
app.use('/login',LogInRoutes);

//static files
//Rewrite the direction to generate clean navigation
app.get('*',function(req, res, next){
	res.sendFile(path.resolve('client/index.html'))
});

//Se habilita el Puerto de escucha (3000)
app.listen(app.get('port'), () =>{
    console.log('Server on Port ', app.get('port'))
});