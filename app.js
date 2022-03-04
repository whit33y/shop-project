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
const product = require('./models/product');
const { findById } = require('./models/product');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//ejs templaty, wplatanie jsa do html'a



app.listen(3000, ()=>{
    console.log('Listening on port 3000')
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
    res.redirect(`products/${product._id}`)
})
app.get('/products/:id', async(req,res,next)=>{
    const {id} = req.params
    const product =  await Product.findById(id)
    console.log(product)
    res.render('pages/subpages/showproduct', {product})
})
// router.get('/:id', wrapAsync(async(req,res)=>{
//     const campground = await Campground.findById(req.params.id).populate('reviews');
//     if(!campground){
//         req.flash('error', 'Cannot find that campground!')
//         return res.redirect('/campgrounds')
//     }
//     res.render('campgrounds/showcamp', {campground})
// }))
app.get('/about', (req,res)=>{
    res.render('pages/about')
})