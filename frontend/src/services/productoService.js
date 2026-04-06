const API_URL = "http://localhost:5057/api/Producto";

export const getProductos = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const getProductoById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
};

export const createProducto = async (producto) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });
    return await response.json();
};

export const updateProducto = async (id, producto) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });
    return await response.json();
};

export const deleteProducto = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};