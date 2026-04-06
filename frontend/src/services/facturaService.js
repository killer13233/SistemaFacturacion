const API_URL = "http://localhost:5057/api/Factura";

export const getFacturas = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const getFacturaById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
};

export const createFactura = async (factura) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factura)
    });
    return await response.json();
};

export const deleteFactura = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};