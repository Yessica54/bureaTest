var express = require('express');
var moment = require('moment');
const bodyParser= require('body-parser');
var fs = require('fs');
var app = express();
var db;
var documentsCollection;
const MongoClient = require('mongodb').MongoClient

// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }))


MongoClient.connect("mongodb+srv://root:FoYrdyxSUiIAI8ye@cluster0.zc1uk.mongodb.net/<dbname>?retryWrites=true&w=majority", { useUnifiedTopology: true })
  .then(client => {
    db = client.db('test');
    documentsCollection = db.collection('documents');
}).catch(console.error);

// routes for app
app.get('/', function(req, res) {
    res.render('pad', {moment: moment});
});

// Obtiene Documentos
app.get('/documents', function(req, res){
    db.collection('documents').find().toArray()
    .then(results => {
        res.render('documents', {documents: results, moment: moment});
    }) 
    .catch(error => console.error(error))
});

// Obtiene un documento
app.get('/document', function(req, res){
    console.log(req.query);
    db.collection('documents').findOne({title: req.query.title})
    .then(results => {
        res.send(results);
    }) 
    .catch(error => console.error(error))
});

//Guardar un documento
app.post('/documents', function(req, res){
    console.log(req.body);
    documentsCollection.update({title: req.body.title},req.body,{upsert: true})
    .then(result => {
        if (fs.existsSync('files/'+req.body.title+'.md')) {
            deleteFile(req.body.title);
            saveFile(req.body.title, req.body.text);
        }else{
            saveFile(req.body.title, req.body.text);
        }
        res.send(true);
    })
    .catch(error => {res.send(false);console.error(error)});
});

// Elimina documentos
app.delete('/documents', function(req, res){
    console.log(req.body.document);
    documentsCollection.deleteOne(
        {"title": req.body.document}
    ).then(result => {
        if(deleteFile(req.body.document)){
            res.send(true);
        }else{
            res.send(false);
        }
    }).catch(error => {res.send(false);console.error(error)});
});

deleteFile =(name) => {
    try {    
        fs.unlinkSync('files/'+name+'.md');
    } catch(err) {
        console.error(err);
        return false;
    }
    return true;
};

saveFile =(name, text) => {
    fs.writeFile('files/'+name+'.md', text, function (err) {
        if (err) throw err;
        return true;
    });
}
  
// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
app.listen(port);