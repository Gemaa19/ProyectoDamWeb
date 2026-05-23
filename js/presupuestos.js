// js/presupuestos.js

async function obtenerPresupuestosWeb() {
    const token = localStorage.getItem("auth_token");
    const contenedorPresupuestos = document.getElementById("lista-presupuestos");
    
    if (!contenedorPresupuestos) return;

    try {
        // 1. Descargamos los presupuestos y las transacciones en paralelo de AWS
        const [resPresupuestos, resTransacciones] = await Promise.all([
            fetch(`${URL_BASE}/presupuestos`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            }),
            fetch(`${URL_BASE}/transacciones`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
        ]);

        if (resPresupuestos.ok && resTransacciones.ok) {
            const presupuestos = await resPresupuestos.json();
            const transacciones = await resTransacciones.json();

            contenedorPresupuestos.innerHTML = ""; // Limpiamos la pantalla anterior

            if (presupuestos.length === 0) {
                contenedorPresupuestos.innerHTML = `<p style="color: var(--gris-texto); text-align:center; margin-top:20px;">No hay presupuestos configurados este mes.</p>`;
                return;
            }

            presupuestos.forEach(presupuesto => {
                // 2. Calculamos el gasto real acumulado para la categoría de este presupuesto
                const totalGastado = transacciones
                    .filter(t => t.tipo === "GASTO" && t.categoriaId === presupuesto.categoriaId)
                    .sumOf = transacciones.reduce((suma, t) => t.tipo === "GASTO" && t.categoriaId === presupuesto.categoriaId ? suma + t.monto : suma, 0);

                // 3. Calculamos la proporción y el porcentaje de consumo
                const ratio = presupuesto.montoLimite > 0 ? (totalGastado / presupuesto.montoLimite) : 0;
                const porcentajeEstilo = Math.min(ratio * 100, 100).toFixed(0); // Capamos la barra al 100% visual
                const porcentajeTexto = (ratio * 100).toFixed(0);

                // 4. Lógica de colores pastel dinámica según el peligro de desborde
                let colorBarra = "barra-verde"; // Salvia por defecto
                if (ratio >= 1.0) {
                    colorBarra = "barra-roja"; // Alerta: Límite superado
                } else if (ratio >= 0.8) {
                    colorBarra = "barra-amarilla"; // Aviso: Al 80% de consumo
                }

                // 5. Inyectamos la cápsula en el DOM usando tus estilos de style.css
                contenedorPresupuestos.innerHTML += `
                    <div class="meta-item" style="background: #FFFFFF; padding: 16px; border-radius: 16px; border: 1px solid var(--gris-borde); margin-bottom: 12px;">
                        <div class="meta-info">
                            <strong>🛍️ ${presupuesto.nombreCategoria}</strong>
                            <span class="monto">${totalGastado.toFixed(2)}€ / ${presupuesto.montoLimite.toFixed(2)}€ (${porcentajeTexto}%)</span>
                        </div>
                        <div class="barra-progreso-fondo" style="margin-top: 8px;">
                            <div class="barra-progreso-relleno ${colorBarra}" style="width: ${porcentajeEstilo}%"></div>
                        </div>
                    </div>
                `;
            });
        } else {
            console.error("Error en la respuesta de las peticiones a AWS");
        }
    } catch (e) {
        console.error("Error de red al cargar presupuestos web:", e);
    }
}