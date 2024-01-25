import "../config/db.js";
import { ProductosModel } from "../modules/productos.modules.js";

export class ProductoDao {

    ID_FIELD = "_id";

    /**
     * Verifica si un producto existe por su ID.
     * @param {string} id - ID del producto a verificar.
     * @returns {Promise<object | null>} - Retorna el producto o null si no existe.
     */
    static async existe(id) {
        try {
            return await ProductosModel.findById(id);
        } catch (error) {
            console.error("Error al verificar si el producto existe:", error);
        }
    }

    /**
     * Obtiene todos los productos.
     * @returns {Promise<object[] | boolean>} - Retorna la lista de productos o false si hay un error.
     */
    async obtenerTodos() {
        try {
            return await ProductosModel.find();
        } catch (error) {
            console.error("Error al obtener todos los productos:", error);
            return false;
        }
    }

    /**
     * Obtiene un producto por su ID.
     * @param {string} objectId - ID del producto a obtener.
     * @returns {Promise<object | boolean>} - Retorna el producto o false si hay un error.
     */
    async obtenerProductoPorId(objectId) {
        try {
            const producto = await ProductosModel.findOne({
                [this.ID_FIELD]: objectId
            });
            console.log(producto);
            return producto;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            return false;
        }
    }

    /**
     * Crea un nuevo producto.
     * @param {object} objeto - Objeto que contiene la información del producto.
     * @returns {Promise<object | boolean>} - Retorna el producto creado o false si hay un error.
     */
    async crearProducto(objeto) {
        try {
            return await ProductosModel.create(objeto);
        } catch (error) {
            console.error("Error al crear el producto:", error);
            return false;
        }
    }

    /**
     * Actualiza un producto por su ID.
     * @param {string} id - ID del producto a actualizar.
     * @param {object} objeto - Objeto que contiene la información actualizada del producto.
     * @returns {Promise<boolean>} - Indica si la operación fue exitosa.
     */
    async actualizarProductoPorId(id, objeto) {
        try {
            await ProductosModel.findByIdAndUpdate(
                {
                    [this.ID_FIELD]: id
                },
                objeto,
                {
                    runValidators: true
                }
            );
            return true;
        } catch (error) {
            console.error("Error al actualizar producto por ID:", error);
            return false;
        }
    }

    /**
     * Elimina un producto por su ID.
     * @param {string} id - ID del producto a eliminar.
     * @returns {Promise<boolean>} - Indica si la operación fue exitosa.
     */
    async eliminarProductoPorId(id) {
        try {
            return await ProductosModel.findByIdAndDelete({ [this.ID_FIELD]: id });
        } catch (error) {
            console.error("Error al eliminar producto por ID:", error);
            return false;
        }
    }
}
