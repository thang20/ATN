
const express = require('express');
const engines = require('consolidate');
const app = express();
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: false}))
app.set('view engine', '.hbs');

//app.set('view engine', 'ejs');

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://ngocthang:ngocthang@cluster0.rwjhi.mongodb.net/test';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url, { useUnifiedTopology: true });
    let dbo = client.db("asm2ATN");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

app.get('/add', function(req,res){
   console.log("dsadss");
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

app.get('/edit',async(req,res)=>{
    let id = req.query.id;
    var ObjectID =  require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("asm2ATN");
    let results = await dbo.collection("product").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{sanPham:results});

    
    
  
})

app.post('/edit',async(req,res)=>{
    

    let id1 = req.body._id;
    let name1 = req.body.name;
    let price1 = req.body.price;
    let category1 = req.body.category;
    

    let newValue = { $set: {name : name1, price : price1, category : category1,}}
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id1)};
    let client = await MongoClient.connect(url);
    let dbo = client.db("asm2ATN");
    await dbo.collection("product").updateOne(condition, newValue, (err, results)=>{
        console.log(results)
        if(err)return console.log(err)
        console.log('saved to data')
    } );
    
    let results = await dbo.collection("product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});

    }) ;
   
const PORT = process.env.PORT || 5000
var server=app.listen(PORT,function() {
    console.log("Server is running at " + PORT);
});