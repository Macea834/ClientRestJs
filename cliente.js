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