// ==========================================================================
// MOVIMIENTOS.JS - GASTOS E INGRESOS (AWS RDS ESPEJO)
// ==========================================================================

let datosMovimientos = {
    gastos: [
        { id: 101, descripcion: "Alquiler Piso Alcorcón", monto: 550.00, fecha: "2026-05-01", categoria: "Hogar" },
        { id: 102, descripcion: "Suscripción Netflix", monto: 17.99, fecha: "2026-05-10", categoria: "Otros" },
        { id: 103, descripcion: "Compra Mercadona", monto: 82.50, fecha: "2026-05-15", categoria: "Comida" }
    ],
    ingresos: [
        { id: 201, descripcion: "Nómina Desarrolladora DAM", monto: 1850.00, fecha: "2026-05-25", categoria: "Sueldo" },
        { id: 202, descripcion: "Venta Ropa Wallapop", monto: 250.00, fecha: "2026-05-18", categoria: "Otros" }
    ]
};

function calcularBalancesResumen() {
    let tIngresos = datosMovimientos.ingresos.sumOf(i => i.monto);
    let tGastos = datosMovimientos.gastos.sumOf(g => g.monto);
    let tPresupuestos = datosPresupuestos.sumOf(p => p.montoLimite); // Traído de presupuestos.js
    
    let dineroLibreReal = tIngresos - tPresupuestos;

    document.getElementById("saldo-total").innerText = `${dineroLibreReal.toFixed(2)}€`;
    document.getElementById("ingresos-totales-web").innerText = `${tIngresos.toFixed(2)}€`;
    document.getElementById("gastos-totales-web").innerText = `${tGastos.toFixed(2)}€`;
}

function renderizarMovimientos(sub, contenedor, modo, selectorHtml) {
    let coleccion = datosMovimientos[sub];
    coleccion.forEach(item => {
        const fila = document.createElement("div");
        fila.className = "fila-datos-capsula";
        
        let sel = modo === "modificar" ? `<input type="radio" name="radio-modificar" class="selector-crud-radio" value="${item.id}">` :
                  modo === "eliminar" ? `<input type="checkbox" class="selector-crud-check" value="${item.id}" onchange="actualizarContadorEliminar()">` : "";

        fila.innerHTML = `${sel} <div class="info-capsula-texto"><strong>${item.descripcion}</strong> <span style="color:gray; font-size:12px; margin-left:15px;">${item.fecha} | Cat: ${item.categoria}</span></div> <div class="monto-capsula">${item.monto.toFixed(2)}€</div>`;
        contenedor.appendChild(fila);
    });
}