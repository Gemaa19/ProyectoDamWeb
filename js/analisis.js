// ==========================================================================
// ANALISIS.JS - GRÁFICOS MULTI-CANVAS Y PUENTE FORMULARIOS
// ==========================================================================

let graficosInstanciados = {};
let elementoEditandoId = null;

function renderizarListaDinamica() {
    const contenedor = document.getElementById("contenedor-lista-dinamica");
    contenedor.innerHTML = "";

    if (subPestanaActual === "gastos" || subPestanaActual === "ingresos") {
        renderizarMovimientos(subPestanaActual, contenedor, modoCrudActivo);
    } else if (subPestanaActual === "presupuestos") {
        renderizarPresupuestos(contenedor, modoCrudActivo);
    } else if (subPestanaActual === "metas") {
        renderizarMetas(contenedor, modoCrudActivo);
    }
    
    // Si entramos en modo modificar, reenganchamos los listeners
    if (modoCrudActivo === "modificar") {
        document.querySelectorAll(".selector-crud-radio").forEach(radio => {
            radio.addEventListener("change", function() { abrirModalEditar(this.value); });
        });
    }
}

function abrirModalEditar(id) {
    elementoEditandoId = parseInt(id);
    document.getElementById("modal-titulo").innerText = `Modificar Registro: ${subPestanaActual.toUpperCase()}`;
    generarCamposFormularioModal();
    
    let item;
    if (subPestanaActual === "gastos" || subPestanaActual === "ingresos") {
        item = datosMovimientos[subPestanaActual].find(x => x.id === elementoEditandoId);
        document.getElementById("form-desc").value = item.descripcion;
        document.getElementById("form-monto").value = item.monto;
    } else if (subPestanaActual === "presupuestos") {
        item = datosPresupuestos.find(x => x.id === elementoEditandoId);
        document.getElementById("form-desc").value = item.nombre;
        document.getElementById("form-monto").value = item.montoLimite;
    } else if (subPestanaActual === "metas") {
        item = datosMetas.find(x => x.id === elementoEditandoId);
        document.getElementById("form-desc").value = item.nombre;
        document.getElementById("form-monto").value = item.objetivo;
        document.getElementById("form-ahorrado").value = item.ahorrado;
    }
    document.getElementById("modal-formulario").style.display = "flex";
}

function generarCamposFormularioModal() {
    const contenedor = document.getElementById("modal-campos");
    if (subPestanaActual === "gastos" || subPestanaActual === "ingresos") {
        contenedor.innerHTML = `<label>Descripción</label><input type="text" id="form-desc"><label>Monto (€)</label><input type="number" id="form-monto">`;
    } else if (subPestanaActual === "presupuestos") {
        contenedor.innerHTML = `<label>Nombre</label><input type="text" id="form-desc"><label>Monto Límite (€)</label><input type="number" id="form-monto">`;
    } else if (subPestanaActual === "metas") {
        contenedor.innerHTML = `<label>Nombre Meta</label><input type="text" id="form-desc"><label>Objetivo (€)</label><input type="number" id="form-monto"><label>Llevas ahorrado (€)</label><input type="number" id="form-ahorrado">`;
    }
}

function guardarFormulario() {
    const desc = document.getElementById("form-desc").value;
    const monto = parseFloat(document.getElementById("form-monto").value);

    if (elementoEditandoId === null) {
        let nuevo = { id: Date.now(), categoria: "General" };
        if (subPestanaActual === "gastos" || subPestanaActual === "ingresos") {
            nuevo.descripcion = desc; nuevo.monto = monto; nuevo.fecha = "2026-05-24";
            datosMovimientos[subPestanaActual].push(nuevo);
        } else if (subPestanaActual === "presupuestos") {
            nuevo.nombre = desc; nuevo.montoLimite = monto; datosPresupuestos.push(nuevo);
        } else if (subPestanaActual === "metas") {
            nuevo.nombre = desc; nuevo.objetivo = monto; nuevo.ahorrado = parseFloat(document.getElementById("form-ahorrado").value) || 0; nuevo.fechaLimite = "2026-12-31";
            datosMetas.push(nuevo);
        }
    } else {
        let item;
        if (subPestanaActual === "gastos" || subPestanaActual === "ingresos") {
            item = datosMovimientos[subPestanaActual].find(x => x.id === elementoEditandoId);
            item.descripcion = desc; item.monto = monto;
        } else if (subPestanaActual === "presupuestos") {
            item = datosPresupuestos.find(x => x.id === elementoEditandoId);
            item.nombre = desc; item.montoLimite = monto;
        } else if (subPestanaActual === "metas") {
            item = datosMetas.find(x => x.id === elementoEditandoId);
            item.nombre = desc; item.objetivo = monto; item.ahorrado = parseFloat(document.getElementById("form-ahorrado").value) || 0;
        }
    }
    cerrarModal();
}

function ejecutarEliminacionMultiple() {
    let checkboxes = document.querySelectorAll(".selector-crud-check:checked");
    let idsABorrar = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (subPestanaActual === "gastos" || subPestanaActual === "ingresos") {
        datosMovimientos[subPestanaActual] = datosMovimientos[subPestanaActual].filter(x => !idsABorrar.includes(x.id));
    } else if (subPestanaActual === "presupuestos") {
        datosPresupuestos = datosPresupuestos.filter(x => !idsABorrar.includes(x.id));
    } else if (subPestanaActual === "metas") {
        datosMetas = datosMetas.filter(x => !idsABorrar.includes(x.id));
    }

    modoCrudActivo = "lectura";
    document.getElementById("btn-confirmar-eliminar").style.display = "none";
    renderizarListaDinamica();
}

// RENDER DE LOS 4 GRÁFICOS EXCLUSIVOS DE TU TFG
function inicializarModuloGraficos() {
    Object.keys(graficosInstanciados).forEach(key => { if (graficosInstanciados[key]) graficosInstanciados[key].destroy(); });
    const mesesLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    graficosInstanciados.gastos = new Chart(document.getElementById("graficoGastosMensuales"), {
        type: 'line', data: { labels: mesesLabels, datasets: [{ label: 'Gastos 2026 (€)', data: [420, 510, 390, 610, 650, 0, 0, 0, 0, 0, 0, 0], borderColor: '#B2130F', tension: 0.3 }] }
    });

    graficosInstanciados.ingresos = new Chart(document.getElementById("graficoIngresosMensuales"), {
        type: 'bar', data: { labels: mesesLabels, datasets: [{ label: 'Ingresos (€)', data: [1850, 1850, 2100, 1850, 2100, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#029B09' }] }
    });

    graficosInstanciados.metas = new Chart(document.getElementById("graficoMetasProgreso"), {
        type: 'doughnut', data: { labels: ["Fondo Emergencia", "Restante", "Oxford C1"], datasets: [{ data: [1200, 1800, 250], backgroundColor: ["#278b7d", "#ECEFF1", "#00A680"] }] }
    });

    graficosInstanciados.comparativo = new Chart(document.getElementById("graficoAnualComparativo"), {
        type: 'bar', data: { labels: mesesLabels, datasets: [{ label: 'Ingresos', data: [1850, 1850, 2100, 1850, 2100, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#0D5140' }, { label: 'Gastos', data: [420, 510, 390, 610, 650, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#E91E63' }] }
    });
}