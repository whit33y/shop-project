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
const User = require('./models/user')
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

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//pasport

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU 
app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})
//NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU NASLUCHIWANIE PORTU 
//routsy
const productRoutes = require('./routes/products')
app.use('/products', productRoutes)

//routsy
//USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY USEROWE ROUTY 
app.get('/register', (req,res)=>{
    res.render('pages/subpages/register')
})
app.post('/register', async(req,res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if(err){
                return next(err)
            }
        console.log(registeredUser)
        req.flash('success','Welcome to shopproject!')
        res.redirect('/home')
        })
        
         }catch(e){
                req.flash('error', e.message);
                res.redirect('register')
         }
})

app.get('/login', (req,res)=>{
    res.render('pages/subpages/login')
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),(req,res)=>{
    console.log('LOGGED IN')
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.redirectUrl
    res.redirect(redirectUrl)
})

app.get('/logout', (req,res)=>{
    req.logOut()
    req.flash('succes', 'Goodbye!')
    res.redirect('/home')
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
