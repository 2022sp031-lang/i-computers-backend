import express from "express";
import createOrder, { getOrders, updateOrderStatusAndNotes } from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post('/', createOrder)
orderRouter.get('/:pageSize/:pageNumbers', getOrders)
orderRouter.put('/:orderId', updateOrderStatusAndNotes)

export default orderRouter