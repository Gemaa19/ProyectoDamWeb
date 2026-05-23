const URL_BASE = "http://56.228.34.149:8080";
// Escuchar el botón de Login
document.getElementById("btn-entrar").addEventListener("click", async () => {
    const correo = document.getElementById("login-correo").value;
    const clave = document.getElementById("login-clave").value;

    try {
        const respuesta = await fetch(`${URL_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: correo, password: clave })
        });

        if (respuesta.ok) {
            const datos = await respuesta.json();
            
            // Guardamos el token de AWS de forma persistente en el navegador
            localStorage.setItem("auth_token", datos.token);
            
            // Cambiamos de pantalla de forma manual en el DOM
            mostrarPanelPrincipal();
        } else {
            alert("Credenciales incorrectas");
        }
    } catch (error) {
        console.error("Error de conexión con AWS:", error);
    }
});
// Variable de control de estado interno
let esModoRegistro = false;

// Función para cambiar de formulario en la misma tarjeta
function alternarFormularioAuth(event) {
    event.preventDefault();
    esModoRegistro = !esModoRegistro;
    
    const titulo = document.getElementById("auth-titulo");
    const campoUsuario = document.getElementById("login-usuario");
    const boton = document.getElementById("btn-entrar");
    const pregunta = document.getElementById("txt-pregunta");
    const enlace = document.getElementById("enlace-auth");
    
    if (esModoRegistro) {
        titulo.innerText = "Crear Cuenta";
        campoUsuario.style.display = "block";
        boton.innerText = "Registrarse en Zenit";
        pregunta.innerText = "¿Ya tienes cuenta?";
        enlace.innerText = "Inicia sesión";
    } else {
        titulo.innerText = "Iniciar Sesión";
        campoUsuario.style.display = "none";
        boton.innerText = "Entrar a la Plataforma";
        pregunta.innerText = "¿No tienes cuenta?";
        enlace.innerText = "Regístrate";
    }
}

// Modificación del Listener del Botón para que sea inteligente
document.getElementById("btn-entrar").addEventListener("click", async () => {
    const correo = document.getElementById("login-correo").value;
    const clave = document.getElementById("login-clave").value;
    
    if (esModoRegistro) {
        // --- FLUJO DE REGISTRO EN AWS ---
        const username = document.getElementById("login-usuario").value;
        if (!username || !correo || !clave) return alert("Rellena todos los campos");
        
        try {
            const respuesta = await fetch(`${URL_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, email: correo, password: clave })
            });
            
            if (respuesta.ok) {
                alert("¡Usuario creado con éxito! Ya puedes iniciar sesión.");
                document.getElementById("enlace-auth").click(); // Forzamos la vuelta al login limpio
            } else {
                alert("Error al registrar el usuario");
            }
        } catch (e) { console.error(e); }
        
    } else {
        // --- FLUJO DE LOGIN TRADICIONAL ---
        if (!correo || !clave) return alert("Introduce tus credenciales");
        try {
            const respuesta = await fetch(`${URL_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: correo, password: clave })
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                localStorage.setItem("auth_token", datos.token);
                mostrarPanelPrincipal();
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) { console.error(error); }
    }
});
// 💡 SOLUCIÓN: Forzamos la descarga de todo el ecosistema de AWS nada más iniciar sesión
function mostrarPanelPrincipal() {
    document.getElementById("vista-login").style.display = "none";
    document.getElementById("vista-panel").style.display = "block";
    
    // Al igual que haces en el LaunchedEffect de Android, disparamos las 3 consultas en paralelo:
    obtenerMovimientosWeb();   // Descarga e inyecta las transacciones
    obtenerMetasWeb();         // Descarga e inyecta las metas de ahorro
    if (typeof obtenerPresupuestosWeb === "function") {
        obtenerPresupuestosWeb();  // Descarga los límites de categorías que creamos hoy
    }
}
function mostrarNotificacionZenit(mensaje, tipo = "exito") {
    const toast = document.createElement("div");
    toast.className = `toast-zenit ${tipo}`;
    toast.innerText = mensaje;
    
    document.body.appendChild(toast);
    
    // Animación de entrada y salida manual
    setTimeout(() => toast.classList.add("mostrar"), 100);
    setTimeout(() => {
        toast.classList.remove("mostrar");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// Dentro de tu js/movimientos.js o js/app.js (donde proceses los totales)
function actualizarCuadroTotalesWeb(movimientos) {
    const totalIngresos = movimientos.filter(m => m.tipo === "INGRESO").reduce((s, m) => s + m.monto, 0);
    const totalGastos = movimientos.filter(m => m.tipo === "GASTO").reduce((s, m) => s + m.monto, 0);
    const balanceLibre = totalIngresos - totalGastos;

    // Pintamos los datos de la RDS en las tres columnas horizontales
    document.getElementById("saldo-total").innerText = `${balanceLibre.toFixed(2)}€`;
    document.getElementById("ingresos-totales-web").innerText = `${totalIngresos.toFixed(2)}€`;
    document.getElementById("gastos-totales-web").innerText = `${totalGastos.toFixed(2)}€`;
}
// ==========================================================================
// 4. ACCIÓN DE BORRAR (Para que funcione el botón de la papelera)
// ==========================================================================


// Función para alternar entre pantallas en el index sin recargar
function cambiarPestana(idSeccionObjetivo) {
    const secciones = document.querySelectorAll('.pestana-contenido');
    secciones.forEach(sec => sec.style.display = 'none');

    const enlaces = document.querySelectorAll('.enlace-nav');
    enlaces.forEach(enlace => enlace.classList.remove('activo'));

    document.getElementById(idSeccionObjetivo).style.display = 'block';

    const enlaceActivo = Array.from(document.querySelectorAll('.enlace-nav'))
        .find(e => e.getAttribute('onclick').includes(idSeccionObjetivo));
    if (enlaceActivo) enlaceActivo.classList.add('activo');
    
    // 💡 SOLUCIÓN: Disparadores automáticos para nutrir las tablas web
    if (idSeccionObjetivo === 'sec-movimientos') {
        obtenerMovimientosWeb();
    } else if (idSeccionObjetivo === 'sec-metas') {
        obtenerMetasWeb(); // Llama a tu función fetch de metas
    } else if (idSeccionObjetivo === 'sec-presupuestos') {
        // Aquí llamarías a obtenerPresupuestosWeb() cuando lo programes
    } else if (idSeccionObjetivo === 'sec-analisis') {
        renderizerGraficoWeb();
    }
}

// js/app.js

// Lógica de apertura del Modal genérico para inserciones rápidas
function abrirModal(tipo) {
    const modal = document.getElementById("modal-formulario");
    const titulo = document.getElementById("modal-titulo");
    const campos = document.getElementById("modal-campos");
    
    titulo.innerText = `Crear Nuevo ${tipo}`;
    modal.style.display = "flex";
    
    if (tipo === 'Gasto' || tipo === 'Ingreso') {
        campos.innerHTML = `
            <input type="text" id="form-desc" placeholder="Descripción (ej. Supermercado)">
            <input type="number" id="form-monto" placeholder="Importe (€)">
            <input type="text" id="form-cat" placeholder="ID Categoría (1-4)">
        `;
    } else if (tipo === 'Meta') {
        campos.innerHTML = `
            <input type="text" id="form-desc" placeholder="Nombre del objetivo">
            <input type="number" id="form-monto" placeholder="Cantidad total meta (€)">
            <input type="number" id="form-ahorrado" placeholder="Dinero acumulado inicial (€)">
        `;
    }
}

function cerrarModal() {
    document.getElementById("modal-formulario").style.display = "none";
}