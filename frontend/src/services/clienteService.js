import axios from 'axios'

const BASE = 'http://localhost:5141/api/Cliente'

export async function buscarClientePorCedula(cedula) {
  try {
    const { data } = await axios.get(`${BASE}/cedula/${cedula}`)
    return data
  } catch (err) {
    if (err.response?.status === 404) return null
    throw err
  }
}

export async function obtenerClientes() {
  const { data } = await axios.get(BASE)
  return data
}

export async function crearCliente(cliente) {
  const { data } = await axios.post(BASE, cliente)
  return data
}

export async function actualizarCliente(id, cliente) {
  const { data } = await axios.put(`${BASE}/${id}`, cliente)
  return data
}

export async function eliminarCliente(id) {
  await axios.delete(`${BASE}/${id}`)
}