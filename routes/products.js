const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const {productSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware')


//PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY 
router.get('/', async(req,res)=>{
    const products = await Product.find({})
    res.render('pages/products', {products})
})
router.get('/createproduct', isLoggedIn, (req,res)=>{
    res.render('pages/subpages/createproduct')
})
router.post('/', isLoggedIn,  async(req,res,next)=>{
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
router.get('/:id', async(req,res,next)=>{
    const {id} = req.params
    const product =  await Product.findById(id)
    console.log(product)
    res.render('pages/subpages/showproduct', {product})
})
router.delete('/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
})
//PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY PRODUKTOWE ROUTY 
module.exports = router;