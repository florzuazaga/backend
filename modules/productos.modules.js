import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        max: 1000
    },
    code: {
        type: String,
        required: true,
        max: 8,
        unique: true
    },
    image: {
        type: String,
        max: 400
    },
    stock: {
        type: Number,
        required: true,
        max: 8000
    }
})

export const ProductosModel = mongoose.model("productos", Schema);