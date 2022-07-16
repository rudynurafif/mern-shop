import Product from '../models/productModels.js'
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Fecth all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Number(req.query.pageNumber) || 1

  // search by keyword functionality
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, // untuk pencarian flexible, contoh ketik iph lalu muncul iphone
          $options: 'i', // case insensitive, tidak sensitif terhadap strict keyword
        },
      }
    : {}

  const count = await Product.count({ ...keyword })

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fecth single products
// @route   GET /api/products/:id
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

// @desc    Delete a products
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a products
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // instansiasi produk baru dgn dummy atau sample data
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  // save ke database
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a products
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // destructure dari body (form)
  const { name, price, description, image, brand, category, countInStock } =
    req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  // Bring in user orders to check if they ordered the product
  const orders = await Order.find({ user: req.user._id })

  // Array of product ids that the user ordered
  const ordersItems = [].concat.apply(
    [],
    orders.map((order) =>
      order.orderItems.map((item) => item.product.toString())
    )
  )

  if (product) {
    // Check if the id of the product matches any of the users ordered products
    const hasBought = ordersItems.includes(product._id.toString())

    if (!hasBought) {
      res.status(400)
      throw new Error('You can only review products you bought')
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    // if not review the product before, review didefinisikan
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    // input ke database
    product.reviews.push(review)

    // tambah num reviews
    product.numReviews = product.reviews.length

    // overall rating avg
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    // save ke db
    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   POST /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  // sort by rating ascending (-1) dan limit by 3
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
