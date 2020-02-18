const Product = require('../models/product')
const mongoose = require('mongoose')

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: `${req.protocol}://${req.get('host')}${req.originalUrl}${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

}

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Created product sucefuly',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    requests: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}${req.originalUrl}${result._id}`
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })


}

exports.products_get_product= (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}${req.baseUrl}`
                    }
                })
            }
            else {
                res.status(404).json({ message: 'No valid entry found provided ID' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: `${req.protocol}://${req.get('host')}${req.originalUrl}${id}`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
                    body: {
                        name: 'String',
                        price: 'Nummber'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}