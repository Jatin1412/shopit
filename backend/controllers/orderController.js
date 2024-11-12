import Order from "../models/order.js"
import Product from "../models/products.js"

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a new order   =>  /api/v1/order/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems = null,
        shippingInfo = null,
        itemsAmount = 0,
        taxAmount = 0,
        shippingAmount = 0,
        totalAmount = 0,
        paymentInfo = null,
        paymentMethod = null
    } = req.body || {}; // Fallback to an empty object if req.body is undefined

    // Check if essential properties are missing
    if (!orderItems) {
        return next(new ErrorHandler("Order items are required", 400));
    }
    if (!shippingInfo) {
        return next(new ErrorHandler("Shipping info is required", 400));
    }
    if (!paymentMethod) {
        return next(new ErrorHandler("Payment method is required", 400));
    }

    // Create the order
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsAmount,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        order
    });
});



// Get Order Details   =>   /api/v1/order/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders   =>   /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).populate("user", "name email");

    if (!orders || orders.length === 0) {
        return next(new ErrorHandler("No orders found for this user", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});


// Get all orders - ADMIN  =>   /api/v1/admin/orders/
export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    res.status(200).json({
        success: true,
        orders
    })
})

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("No orders found with this ID", 404));
    }

    if (order?.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString());
        if (!product) {
            return next(new ErrorHandler("No Product found with this ID", 404));
        }
        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
    })
});

// Delete order   =>   /api/v1/admin/order/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    await order.deleteOne();

    res.status(200).json({
        success: true
    })
})