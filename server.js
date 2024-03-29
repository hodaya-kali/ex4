const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs')
    //routers = require('./server/routes/routes.js');
    require('./src/db/mongoose')
    const userRouter = require('./src/routers/conference')
const taskRouter = require('./src/routers/lecture')

const port = 3001;

const app=express();

app.use('/list', express.static(path.join(__dirname, 'client/html/conferences_list.html')));
app.use('/list_users', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/add_user', express.static(path.join(__dirname, 'client/html/add_user_form.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));

/*app.get('/',(req,res) => {fs.readFile('client/html/index.html',  (err, html) => {
    if (err) {
        throw err; 
    }       
    
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end();  
    })
});*/

app.use('/css', express.static(path.join(__dirname, 'client/css')));

//restfull 
//app.use(cors());
app.use(express.json());
app.use(userRouter)
app.use(taskRouter)
app.use(express.urlencoded({ extended: true }));

//app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});