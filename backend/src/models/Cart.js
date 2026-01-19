import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    toyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Toys",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtTheMoment: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [cartItemSchema]
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
