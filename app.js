//express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
//express do szkieletów stronek

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shop-project')
    .then(()=>{
        console.log('Mongo connected');
    })
    .catch(err=>{
        console.log('Mongo connection error: ', err);
    })
//mongoose połączenie z bazą danych mongo, zeby mozna klepac komendy do niej

//path
const path = require('path');
app.use(express.static(path.join(__dirname,'public')))
//path

//ejs
const ejsMate = require('ejs-mate'); 
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//ejs templaty, wplatanie jsa do html'a



app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})
app.get('/',(req,res)=>{
    res.send('XD DZIALA')
})
app.get('/home',(req,res)=>{
    res.render('pages/home')
})
app.get('/products', (req,res)=>{
    res.render('pages/products')
})
app.get('/about', (req,res)=>{
    res.render('pages/about')
})