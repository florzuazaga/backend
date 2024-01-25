import express from "express";
import productRouter from './routes/product.js';
import cartRouter from './routes/cart.js';
import connectToMongoDB from "./config/db.js";

const PORT = 3030;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/productos', productRouter);
app.use('/api/carrito', cartRouter);

// Llama a la función para conectar a MongoDB
connectToMongoDB();
const server = app.listen(PORT, () => {
    console.log(` >>>>> 🚀 Server started at http://localhost:${PORT}`)
    })
    
server.on('error', (err) => console.log(err));