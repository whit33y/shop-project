//express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.urlencoded());
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

//modele
const Product = require('./models/product')
//modele
//path
const path = require('path');
app.use(express.static(path.join(__dirname,'public')))
//path

//method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'));
//method-override

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
app.get('/products/createproduct', (req,res)=>{
    res.render('pages/subpages/createproduct')
})
app.post('/products', async(req,res,next)=>{
    const product = new Product(req.body);
    await product.save()
    res.redirect('products')
})
// router.post('/', validateCampground, wrapAsync(async(req,res,next)=>{
//     // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     req.flash('success', 'Succesfully made a new campgrund!')
//     res.redirect(`campgrounds/${campground.id}`)
// }))
app.get('/about', (req,res)=>{
    res.render('pages/about')
})