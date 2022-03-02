import Product from '../models/productModels.js'
import asyncHandler from 'express-async-handler'

// @desc    Fecth all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    
  res.json(products)
})

// @desc    Fecth single products
// @route   GET /api/products:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
})

export { getProducts, getProductById }