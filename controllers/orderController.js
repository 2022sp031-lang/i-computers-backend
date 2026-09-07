import Order from "../models/order.js";
import Product from "../models/product.js";

export default async function createOrder(req, res) {
    const user = req.user;

    if(user == null) {
        req.status(401).json({
            message: "You need to login first to place an order"
        })
        return
    }

    //let orderId = "ORD0000001";
    const orderData = {
        orderId: "ORD0000001",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        addressLineOne: req.body.addressLineOne,
        addressLineTwo: req.body.addressLineTwo,
        city: req.body.city,
        state: req.body.city,
        postalCode: req.body.postalCode,
        total: 0,
        phone: req.body.phone,
        items: []
    }

    if(req.body.firstName != null && req.body.firstName !="") {
        orderData.firstName = req.body.firstName;
    }
    if(req.body.lastName != null && req.body.lastName !="") {
        orderData.lastName = req.body.lastName;
    }

    try{
        const lastOrder = await Order.findOne().sort({date: -1});

        if(lastOrder != null) {
            const lastOrderId = lastOrder.orderId;
            const lastOrderNumberInString = lastOrderId.replace("ORD", "");
            const lastOrderNumber = parseInt(lastOrderNumberInString);
            const newOrderNumber = lastOrderNumber + 1;
            const newNumberInString = newOrderNumber.toString().padStart(6, "0");
            orderData.orderId = "ORD" + newNumberInString;
        }

        for(let i=0; i < req.body.items.length; i++) {
            const product = await Product.findOne({productId : req.body.items[i].productId});
            if(product == null || !product.isAvailable) {
                res.status(400).json({
                    message: "Product with productId " + req.body.items[i].productId + "Not found. Please place your order without this product."
                })
                return
            }else {

                orderData.items.push({
                    product: {
                        productId: product.productId,
                        name: product.name,
                        price: product.price,
                        labelPrice: product.labelPrice,
                        image: product.images[0]
                    },
                    quantity: req.body.items[i].quantity
                })

                orderData.total += product.price * req.body.items[i].quantity;
            }
        }
        const newOrder = new Order(orderData)
        newOrder.save()

        res.status(201).json({
            message: "Order placed successfully."
        })


    }catch(error) {
        console.log(error)
        res.status(500).json({
            message: "Error creating order"
        })
    }
}

export async function getOrders(req, res) {
    try{
        if(req.user == null) {
            res.status(401).json({
                message: "You need to be logged first in to your orders."
            })
            return
        }

        console.log(req.params)
        const pageSizeInString = req.params.pageSize || "10";
        const pageNumberInString = req.params.pageNumber || "1";

        const pageSize = parseInt(pageSizeInString);
        const pageNumber = parseInt(pageNumberInString);

        if(pageSize < 1 || pageSize > 100) {
            res.stsus(400).json({
                message: "Page size should be 1 and 100."
            })
        }

        if(req.user.isAdmin) {
            const orderCount = await Order.countDocuments();
            const totalPages = Math.ceil(orderCount/pageSize);

            const orders = await Order.find().sort({date : -1}).skip((pageNumber - 1) * pageSize).limit(pageSize);
            res.status(200).json({
                orders: orders,
                totalPages: totalPages,
                total: orderCount
            })

        }else {
            const orderCount = await Order.countDocuments({ email : req.user.email }).sort({date : -1}).skip((pageNumber - 1) * pageSize).limit(pageSize);;

            const orders = await Order.find({
                email : req.user.email
            });
            res.status(200).json({
                orders: orders,
                totalPages: totalPages,
                total: orderCount
            })
        }

    }catch(error) {
        console.log(error)
    }
}