// ==========================================================================
// PRESUPUESTOS.JS - LÍMITES POR CATEGORÍA
// ==========================================================================

let datosPresupuestos = [
    { id: 301, nombre: "Límite Comida Mensual", montoLimite: 200.00, categoria: "Comida" },
    { id: 302, nombre: "Límite Transportes Cercanías", montoLimite: 50.00, categoria: "Transporte" }
];

function renderizarPresupuestos(contenedor, modo) {
    datosPresupuestos.forEach(item => {
        const fila = document.createElement("div");
        fila.className = "fila-datos-capsula";

        let sel = modo === "modificar" ? `<input type="radio" name="radio-modificar" class="selector-crud-radio" value="${item.id}">` :
                  modo === "eliminar" ? `<input type="checkbox" class="selector-crud-check" value="${item.id}" onchange="actualizarContadorEliminar()">` : "";

        fila.innerHTML = `${sel} <div class="info-capsula-texto"><strong>${item.nombre}</strong> <span style="color:gray; font-size:12px; margin-left:15px;">Límite Categoría: ${item.categoria}</span></div> <div class="monto-capsula">${item.montoLimite.toFixed(2)}€</div>`;
        contenedor.appendChild(fila);
    });
}