
const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://ngocthang:ngocthang@cluster0.rwjhi.mongodb.net/test';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("asm2ATN");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

app.get('/add', function(req,res){
    res.render('addSanPham');
});

app.post('/doAddProduct',async function(req,res){
    var insertProducts = {
        _id : req.body._id,
        name : req.body.name,
        price : req.body.price,
        category : req.body.category,

    };
    let client= await MongoClient.connect(url);
    let dbo = client.db("asm2ATN");
    await dbo.collection("product").insertOne(insertProducts, (err, results)=>{
        console.log(results)
        if(err) return console.log(err)
        console.log('saved to data')

    });
    let results = await dbo.collection("product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});

 });


app.get('/delete',async function(req,res){
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("asm2ATN");
    await dbo.collection("product").deleteOne(condition);
    res.redirect('/all');
})

app.get('/edit',async function(req,res){
    // let id = req.query.id;
    // var ObjectID = require('mongodb').ObjectID;
    // let condition = {"_id" : ObjectID(id)};

    // let client= await MongoClient.connect(url);
    // let dbo = client.db("asm2ATN");
    // await dbo.collection("product").deleteOne(condition);
    // res.redirect('/all');
})
const PORT = process.env.PORT || 5000
var server=app.listen(PORT,function() {
    console.log("Server is running at " + PORT);
});