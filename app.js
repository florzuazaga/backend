import express from 'express';
import dotenv from 'dotenv';
import { ProductoDao } from './dao/ProductoDao.js';
import { CarritoDao } from './dao/CarritoDao.js'
import { ProductoCarritoDao } from './dao/ProductoCarritoDao.js';
import knex from 'knex';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const authMiddleware = ((req, res, next) => {
    req.header('authorization') == process.env.TOKEN 
        ? next()
        : res.status(401).json({"error": "no autorizado"})
})

const routerProducts = express.Router();
const routerCart = express.Router();

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);

const productoDao = new ProductoDao();
const carritoDao = new CarritoDao();
const productoCarritoDao = new ProductoCarritoDao();

//Product Endpoints 

// GET api/productos
routerProducts.post('/', authMiddleware, async (req, res, next) => {
    const { body } = req;
    
    body.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    try {
        const nuevoProducto = await productoDao.crearProducto(body);
        
        if (nuevoProducto) {
            res.status(200).json({"success": "Producto agregado con ID: " + nuevoProducto._id});
        } else {
            res.status(400).json({"error": "Algunas claves pueden estar incorrectas. Por favor, verifica el contenido del cuerpo (body)"});
        }
    } catch (error) {
        console.error("Error en la ruta POST /api/productos", error);
        res.status(500).json({"error": "Error interno del servidor"});
    }
});


// GET api/productos/:id
routerProducts.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productoDao.obtenerProductoPorId(id);
        
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({"error": "Producto no encontrado"});
        }
    } catch (error) {
        console.error("Error en la ruta GET /api/productos/:id", error);
        res.status(500).json({"error": "Error interno del servidor"});
    }
});

// POST api/productos
routerProducts.post('/',authMiddleware, async (req,res,next) => {
    const {body} = req;
    
    body.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const newProductId = await productoDao.save(body);
    
    newProductId
        ? res.status(200).json({"success" : "product added with ID: "+newProductId})
        : res.status(400).json({"error": "Algunas claves pueden estar incorrectas. Por favor, verifica el contenido del cuerpo (body)"})
})

// PUT api/productos/:id
routerProducts.put('/:id', authMiddleware,  async (req, res, next) => {
    const {id} = req.params;
    const {body} = req;
    const wasUpdated = await productoDao.updateProductById(body, id);
    
    wasUpdated
        ? res.status(200).json({"success" : "product updated"})
        : res.status(404).json({"error": "producto no encontrado o contenido del cuerpo (body) inválido."})
})

// DELETE /api/productos/:id
routerProducts.delete('/:id', authMiddleware,  async (req, res, next) => {
    const {id} = req.params;
    const wasDeleted = await productoDao.deleteById(id);
    
    wasDeleted 
        ? res.status(200).json({"success": "product successfully removed"})
        : res.status(404).json({"error": "producto no encontrado"})
})
// Cart Endpoints 

// POST /api/carrito
routerCart.post('/', async(req, res) => {
    const newCartId = await carritoDao.save();
    
    newCartId
        ? res.status(200).json({"success" : "cart added with ID: "+newCartId})
        : res.status(400).json({"error": "Hubo un problema, por favor intenta nuevamente más tarde"});
})

// DELETE /api/carrito/id
routerCart.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const wasDeleted = await carritoDao.deleteById(id);
    
    wasDeleted 
        ? res.status(200).json({"success": "cart successfully removed"})
        : res.status(404).json({"error": "carrito no encontrado"})
})

//producto y carrito 

// POST /api/carrito/:id/productos

routerCart.post('/:id/productos', async(req,res) => {
    
    const {id} = req.params;
    const { body } = req;
    
    if (Object.prototype.hasOwnProperty.call(body, 'productId')) {
        const newProductoCarritoId = await productoCarritoDao.saveProductToCart(id, body.productId);
        
        newProductoCarritoId 
            ? res.status(200).json({"success": "Product added correctly to the Cart"})
            : res.status(400).json({"error": "Hubo un problema. Tal vez el ID del carrito o el ID del producto son inválidos"})
        
    } else {
        res.status(400).json({"error": "the key MUST be 'productId', please verify."})
    }
    
})

// DELETE /api/carrito/:id/productos/:id_prod
routerCart.delete('/:id/productos/:id_prod', async(req, res) => {
    const {id, id_prod } = req.params;
    
    const wasDeleted = productoCarritoDao.deleteProductFromCart(id, id_prod);
    
    wasDeleted 
        ? res.status(200).json({"success": "product removed from the cart"})
        : res.status(400).json({"error": "hubo algún problema"})
    
})

// GET /api/carrito/:id/productos
routerCart.get('/:id/productos', async(req, res) => {
    const { id } = req.params;
    const cartProducts = await productoCarritoDao.getAllProductsFromCart(id); 
    if (cartProducts.length) {
        res.status(200).json(cartProducts)
    } else {
        res.status(404).json({"error": "carrito no encontrado o no tiene productos."})
    }
})

const PORT = 8000;
const server = app.listen(PORT, () => {
console.log(` >>>>> 🚀 Server started at http://localhost:${PORT}`)
})

server.on('error', (err) => console.log(err));