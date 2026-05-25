// ==========================================================================
// METAS.JS - METAS DE AHORRO CON BARRAS DE PROGRESO
// ==========================================================================

let datosMetas = [
    { id: 401, nombre: "Fondo de Emergencia", objetivo: 3000.00, ahorrado: 1200.00, fechaLimite: "2026-12-31" },
    { id: 402, nombre: "Certificación Oxford C1", objetivo: 250.00, ahorrado: 250.00, fechaLimite: "2026-06-15" }
];

function renderizarMetas(contenedor, modo) {
    datosMetas.forEach(item => {
        const fila = document.createElement("div");
        fila.className = "fila-datos-capsula";

        let sel = modo === "modificar" ? `<input type="radio" name="radio-modificar" class="selector-crud-radio" value="${item.id}">` :
                  modo === "eliminar" ? `<input type="checkbox" class="selector-crud-check" value="${item.id}" onchange="actualizarContadorEliminar()">` : "";

        let porcentaje = Math.min((item.ahorrado / item.objetivo) * 100, 100);

        fila.innerHTML = `${sel} <div class="info-capsula-texto"><strong>${item.nombre}</strong> <span style="color:gray; font-size:12px; margin-left:15px;">Meta límite: ${item.fechaLimite} (Ahorrado: ${item.ahorrado}€ / Obj: ${item.objetivo}€)</span></div> <div class="monto-capsula" style="color:var(--verde-exito)">${porcentaje.toFixed(0)}%</div>`;
        contenedor.appendChild(fila);
    });
}