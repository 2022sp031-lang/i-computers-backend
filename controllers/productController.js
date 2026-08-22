import Product from "../models/product.js"

export async function createProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message: "Access denied. Admins only."
            }
        )
    }

    try {

        const existingProduct = await Product.findOne(
            {
                productId: req.body.productId
            }
        );

        if (existingProduct != null) {
            res.status(400).json(
                {
                    message: "This product is already exist."
                }
            )
            return
        }

        const newProduct = new Product(
            {
                productId: req.body.productId,
                name: req.body.name,
                altNames: req.body.altNames,
                price: req.body.price,
                labelPrice: req.body.labelPrice,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                model: req.body.model,
                category: req.body.category,
                isAvailable: req.body.isAvailable,
                stock: req.body.stock
            }
        );

        await newProduct.save()
        console.log("Product created successfully.")

        res.status(200).json(
            {
                message: "Product created successfully."
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json(
            {
                message: "Error creating product."
            }
        )
    }
}

export function isAdmin(req, res) {
    if (req.user == null) {
        return false
    }

    if (req.user.isAdmin) {
        return true
    } else {
        return false
    }
}

export async function getAllProducts(req, res) {
    try {
        if (isAdmin(req)) {
            const products = await Product.find();

            res.json(products)
        } else {
            const products = await Product.find({ isAvailable: true });

            res.json(products)
        }

    } catch (error) {
        res.status(500).json(
            {
                message: "Error fetching products."
            }
        )
    }
}

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message: "Access denied. Admins only."
            }
        )
    }

    try {
        await Product.deleteOne({
            productId: req.params.productId
        })

        res.status(200).json(
            {
                message: "Product deleted successfully."
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                message: "Cannot find the requested product."
            }
        )
    }
}

export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message: "Access denied. Admins only."
            }
        )
    }

    try {
        await Product.updateOne({
            productId: req.params.productId
        }, {
            name: req.body.name,
            altNames: req.body.altNames,
            price: req.body.price,
            labelPrice: req.body.labelPrice,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category,
            isAvailable: req.body.isAvailable,
            stock: req.body.stock
        })

    } catch (error) {
        res.status(500).json(
            {
                message: "Error updating product."
            }
        )
    }
}

export async function getProduct(req, res) {
    try {
        const product = await Product.findOne({
            productId: req.params.productId
        })

        if(product == null) {
            res.status(404).json(
                {
                    message: "Product not found."
                }
            )
        }else {
            if(product.isAvailabel) {
                res.json(product)
            }else {
                if(isAdmin(req)) {
                    res.json(product)
                }else {
                    res.status(403).json(
                        {
                            message: "Access denied. Admin only."
                        }
                    )
                }
            }
        }

    } catch (error) {
        res.status(500).json(
            {
                message: "Error fetching product."
            }
        )
    }
} 