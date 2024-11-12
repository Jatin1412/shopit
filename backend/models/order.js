import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User reference is required"],
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        image: {
          type: String,
          required: [true, "Product image is required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product reference is required"],
          ref: "Product",
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["COD", "Card"],
        message: "Payment method must be either 'COD' or 'Card'",
      },
    },
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
    },
    paidAt: {
      type: Date,
    },
    itemsPrice: {
      type: Number,
      required: [true, "Items amount is required"],
      default: 0.0,
    },
    taxAmount: {
      type: Number,
      required: [true, "Tax amount is required"],
      default: 0.0,
    },
    shippingAmount: {
      type: Number,
      required: [true, "Shipping amount is required"],
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0.0,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Shipped", "Delivered"],
        message: "Order status must be 'Processing', 'Shipped', or 'Delivered'",
      },
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
