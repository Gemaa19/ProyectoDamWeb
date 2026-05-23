// js/movimientos.js

async function obtenerMovimientosWeb() {
    const token = localStorage.getItem("auth_token");

    try {
        const respuesta = await fetch(`${URL_BASE}/transacciones`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (respuesta.ok) {
            const movimientos = await respuesta.json();
            const contenedor = document.getElementById("lista-movimientos");
            contenedor.innerHTML = ""; 

            if (movimientos.length === 0) {
                contenedor.innerHTML = `<p style="color: var(--gris-texto); padding: 20px; text-align:center;">No hay movimientos registrados.</p>`;
                return;
            }

            movimientos.forEach(mov => {
                const esIngreso = mov.tipo === "INGRESO";
                const colorClase = esIngreso ? "texto-verde" : "texto-rojo";
                const signo = esIngreso ? "+" : "-";

                contenedor.innerHTML += `
                    <div class="capsula-movimiento">
                        <div class="info-izquierda">
                            <strong>${mov.descripcion || "Movimiento general"}</strong>
                            <span style="font-size:11px; color:gray; margin-left: 10px;">ID Categoria: ${mov.categoriaId || "Sin asignar"}</span>
                        </div>
                        <div class="bloque-acciones-derecha">
                            <span class="monto-web ${colorClase}">${signo}${mov.monto.toFixed(2)}€</span>
                            <button class="btn-control-editar" onclick="abrirModalEditarMovimiento(${mov.id}, '${mov.descripcion}', ${mov.monto}, '${mov.tipo}', ${mov.categoriaId})">✏️</button>
                            <button class="btn-control-editar" style="color:var(--rojo-peligro);" onclick="borrarMovimientoWeb(${mov.id})">🗑️</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error("Error al cargar movimientos:", e);
    }
}