//express
const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.urlencoded());
//express do szkieletów stronek



//joi
const ExpressError = require("./utils/ExpressError");
const {productSchema} = require('./schemas.js')
//joi


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

//session
const session = require('express-session')
app.use(session({
    secret: 'weaksecretboi',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//po 7 dnaich sie przedawnia
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))
//session

//flash
const flash = require('connect-flash')
app.use(flash())
//flash

//wrap
const wrapAsync = require('./utils/wrapAsync');
//wrap

//pasport
const passport = require('passport')
const passportLocal = require('passport-local')
//pasport

//walidacja produktu
// const validateProduct = (req,res,next) =>{
//     const {error} = productSchema.validate(req.body)
//     if(error){
//         const message = error.details.map(el=>el.message).join(',')
//         throw new ExpressError(message, 404)
//     }else{
//     next()
//     }
// }
//walidacja produktu


app.use((req,res,next)=>{
    // console.log(req.session)
    res.locals.success=req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



//NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU 
app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})
//NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU 



//PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY 
app.get('/products', async(req,res)=>{
    const products = await Product.find({})
    res.render('pages/products', {products})
})
app.get('/products/createproduct', (req,res)=>{
    res.render('pages/subpages/createproduct')
})
app.post('/products', async(req,res,next)=>{
    const product = new Product(req.body);
    try {
        const value = await productSchema.validateAsync({ name: product.name , description: product.description, image: product.image, number: product.number  });
        await product.save()
        req.flash('success', 'Successfully made a new product!');
        res.redirect(`products/${product._id}`)
        // res.redirect()
    }
    catch (err) { 
        console.log(err)
        req.flash('error', 'Something went wrong(name must have min 3 chars, description must have min 3 chars max 1000, must have img link and correct telephone number)')
        res.redirect('products')
    }
})
app.get('/products/:id', async(req,res,next)=>{
    const {id} = req.params
    const product =  await Product.findById(id)
    console.log(product)
    res.render('pages/subpages/showproduct', {product})
})
app.delete('/products/:id', async(req,res)=>{
    const {id} = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
})
//PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY 



//USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY 
app.get('/login', (req,res)=>{
    res.render('pages/subpages/login')
})
app.get('/register', (req,res)=>{
    res.render('pages/subpages/register')
})
//USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY 



//INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY INNE ROUTY 

app.get('/home', async(req,res)=>{
    const products = await Product.find({}).sort({name: -1}).limit(5)
    res.render('pages/home', {products})
})

app.get('/about', (req,res)=>{
    res.render('pages/about')
})
