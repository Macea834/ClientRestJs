const BASE_URL = "http://localhost:8080/api/productos";

function leerFormulario() {
    return {
        codigo: document.getElementById("codigo").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: parseFloat(document.getElementById("precio").value)
    };
}

function llenarFormulario(producto) {
    document.getElementById("codigo").value = producto.codigo || "";
    document.getElementById("nombre").value = producto.nombre || "";
    document.getElementById("descripcion").value = producto.descripcion || "";
    document.getElementById("precio").value = producto.precio ?? "";
}

function limpiarFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("tablaProductos").innerHTML = "";
}

// GET /api/productos/buscar?codigo=xxx&nombre=xxx
async function consultarProductoPorCodigoYNombre() {
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();

    if (!codigo || !nombre) {
        alert("Ingresa el código y el nombre del producto.");
        return;
    }

    const parametros = new URLSearchParams({ codigo: codigo, nombre: nombre });
    const url = `${BASE_URL}/buscar?${parametros.toString()}`;
    console.log("URL solicitada:", url);

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: no existe un producto con ese código y nombre`);
        }
        const producto = await respuesta.json();
        llenarFormulario(producto);
        console.log("Producto encontrado:", producto);
    } catch (error) {
        console.error("Error en la consulta:", error);
        alert("Hubo un problema: " + error.message);
    }
}

// GET /api/productos
async function listarProductos() {
    try {
        const respuesta = await fetch(BASE_URL);
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`);
        }
        const productos = await respuesta.json();
        const tbody = document.getElementById("tablaProductos");
        tbody.innerHTML = "";
        productos.forEach(p => {
            tbody.innerHTML += `<tr>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.descripcion ?? ""}</td>
                <td>${p.precio}</td>
            </tr>`;
        });
    } catch (error) {
        console.error("Error al listar:", error);
        alert("Hubo un problema al listar: " + error.message);
    }
}

// POST /api/productos
async function registrarProducto() {
    const producto = leerFormulario();
    if (!producto.codigo || !producto.nombre || !producto.descripcion || isNaN(producto.precio)) {
        alert("Completa todos los campos antes de guardar.");
        return;
    }

    try {
        const respuesta = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        if (respuesta.status === 409) {
            alert("Ya existe un producto con ese código.");
            return;
        }
        if (!respuesta.ok) {
            const mensaje = await respuesta.text();
            throw new Error(`Error ${respuesta.status}: ${mensaje}`);
        }

        const creado = await respuesta.json();
        console.log("Producto guardado:", creado);
        alert("El producto se guardó con éxito.");
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un problema al guardar: " + error.message);
    }
}

// PUT /api/productos/{codigo}
async function actualizarProducto() {
    const producto = leerFormulario();
    if (!producto.codigo) {
        alert("Ingresa el código del producto a actualizar.");
        return;
    }

    try {
        const respuesta = await fetch(`${BASE_URL}/${encodeURIComponent(producto.codigo)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: producto no encontrado`);
        }
        const actualizado = await respuesta.json();
        console.log("Producto actualizado:", actualizado);
        alert("El producto se actualizó con éxito.");
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Hubo un problema al actualizar: " + error.message);
    }
}

// DELETE /api/productos/{codigo}
async function eliminarProducto() {
    const codigo = document.getElementById("codigo").value.trim();
    if (!codigo) {
        alert("Ingresa el código del producto a eliminar.");
        return;
    }

    try {
        const respuesta = await fetch(`${BASE_URL}/${encodeURIComponent(codigo)}`, {
            method: "DELETE"
        });
        if (respuesta.status === 204) {
            alert("Producto eliminado con éxito.");
            limpiarFormulario();
        } else if (respuesta.status === 404) {
            alert("Producto no encontrado.");
        } else {
            throw new Error(`Error ${respuesta.status}`);
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un problema al eliminar: " + error.message);
    }
}