import "../config/db.js";
import { CarritosModel } from '../modules/carritos.modules.js';

export class CarritoDao {
    ID_FIELD = "_id";

    /**
     * Crea un nuevo carrito en la base de datos.
     * @returns {Promise<boolean>} - Indica si la operación fue exitosa.
     */
    async crearCarrito() {
        try {
            return await CarritosModel.create({});
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return false;
        }
    }

    /**
     * Elimina un carrito por su ID.
     * @param {string} id - ID del carrito a eliminar.
     * @returns {Promise<boolean>} - Indica si la operación fue exitosa.
     */
    async eliminarCarritoPorId(id) {
        try {
            return await CarritosModel.findByIdAndDelete({[this.ID_FIELD]: id});
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            return false;
        }
    }

    /**
     * Agrega un producto al carrito.
     * @param {string} id - ID del carrito.
     * @param {Object} obj - Objeto que contiene información del producto a agregar.
     * @returns {Promise<boolean>} - Indica si la operación fue exitosa.
     */
    async agregarProductoAlCarrito(id, obj) {
        try {
            const carrito = await CarritosModel.findById(id);

            if (!carrito) {
                console.error("Carrito no encontrado");
                return false;
            }

            carrito.productos.push(obj.productId);
            await carrito.save();

            return true;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return false;
        }
    }

    /**
     * Elimina un producto del carrito.
     * @param {string} id - ID del carrito.
     * @param {string} productId - ID del producto a eliminar.
     * @returns {Promise<boolean>} - Indica si la operación fue exitosa.
     */
    async eliminarProductoDelCarrito(id, productId) {
        try {
            const carrito = await CarritosModel.findById(id);

            if (!carrito) {
                console.error("Carrito no encontrado");
                return false;
            }

            carrito.productos.remove(productId);
            await carrito.save();

            return true;
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            return false;
        }
    }

    /**
     * Obtiene todos los productos del carrito.
     * @param {string} id - ID del carrito.
     * @returns {Promise<object | boolean>} - Retorna los productos o false si hay un error.
     */
    async obtenerTodosLosProductosDelCarrito(id) {
        try {
            return await CarritosModel.findById(id).populate('productos').select({productos: 1, _id:0});
        } catch (error) {
            console.error("Error al obtener productos del carrito:", error);
            return false;
        }
    }
}
