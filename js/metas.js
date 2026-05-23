// js/metas.js

async function obtenerMetasWeb() {
    const token = localStorage.getItem("auth_token");
    const contenedorObjetivos = document.getElementById("lista-metas");
    if (!contenedorObjetivos) return; 

    try {
        const respuesta = await fetch(`${URL_BASE}/metas`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (respuesta.ok) {
            const metas = await respuesta.json();
            contenedorObjetivos.innerHTML = ""; 

            if (metas.length === 0) {
                contenedorObjetivos.innerHTML = `<p style="color: var(--gris-texto); padding: 20px;">No hay metas de ahorro configuradas.</p>`;
                return;
            }

            metas.forEach(meta => {
                const porcentaje = (meta.progreso).toFixed(0); 

                contenedorObjetivos.innerHTML += `
                    <div class="meta-item" style="background:#FFFFFF; padding:20px; border-radius:16px; border:1px solid var(--gris-borde);">
                        <div class="meta-info">
                            <strong>🎯 ${meta.nombre}</strong>
                            <span class="monto">${meta.ahorrado.toFixed(2)}€ / ${meta.objetivo.toFixed(2)}€ (${porcentaje}%)</span>
                        </div>
                        <div class="barra-progreso-fondo" style="margin: 12px 0;">
                            <div class="barra-progreso-relleno barra-verde" style="width: ${Math.min(porcentaje, 100)}%"></div>
                        </div>
                        <div style="display:flex; justify-content: flex-end; gap: 8px;">
                            <button class="btn-control-editar" onclick="abrirModalEditarMeta(${meta.id}, '${meta.nombre}', ${meta.objetivo}, ${meta.ahorrado})">✏️ Editar Meta</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error("Error al cargar las metas:", e);
    }
}