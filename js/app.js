// ==========================================================================
// APP.JS - ENRUTADOR MAESTRO Y AUTENTICACIÓN REAL EN AWS KTOR
// ==========================================================================

let seccionPrincipalActual = "inicio";
let subPestanaActual = "gastos";
let modoCrudActivo = "lectura"; // lectura | modificar | eliminar

// 💡 URL BASE DE TU SERVIDOR EN LA NUBE (Ajusta la IP o dominio de tu instancia EC2)
const API_URL_BASE = "http://56.228.34.149:8080"; 

async function simularLogin(event) {
    // 💡 SOLUCIÓN: Evitamos que la página web se recargue y borre los estados de Compose/JS
    if (event) event.preventDefault();

    const correo = document.getElementById("login-correo").value.trim();
    const clave = document.getElementById("login-clave").value.trim();
    const usuarioInput = document.getElementById("login-usuario");
    
    if (usuarioInput.style.display === "block") {
        const nombreUser = usuarioInput.value.trim();
        if (!nombreUser || !correo || !clave) {
            alert("Por favor, rellena todos los campos para crear tu cuenta.");
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: nombreUser, email: correo, password: clave })
            });

            if (respuesta.ok) {
                alert("¡Cuenta registrada con éxito en AWS Estocolmo! Ya puedes iniciar sesión.");
                alternarFormularioAuth(new Event('click'));
            } else {
                alert("Error en el registro: El usuario o el email ya están en uso.");
            }
        } catch (error) {
            console.error("Fallo de red en registro:", error);
            alert("Error de conexión con el servidor de AWS.");
        }
        return;
    }

    if (!correo || !clave) {
        alert("Por favor, introduce tu correo electrónico y tu contraseña.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: correo, password: clave })
        });

        if (respuesta.ok) {
            const datosUsuario = await respuesta.json();

            localStorage.setItem("token_jwt", datosUsuario.token);
            localStorage.setItem("user_name", datosUsuario.username);
            localStorage.setItem("user_email", datosUsuario.email);

            document.getElementById("perfil-nombre").innerText = datosUsuario.username;
            document.getElementById("perfil-correo").innerText = datosUsuario.email;
            document.getElementById("header-nombre-avatar").innerText = datosUsuario.username.charAt(0).toUpperCase();
            
            document.getElementById("vista-login").style.display = "none";
            document.getElementById("vista-panel").style.display = "flex";
            irAInicio();

        } else {
            alert("Credenciales incorrectas. El correo electrónico o la contraseña no coinciden en nuestro sistema.");
        }
    } catch (error) {
        console.error("Fallo de red en login:", error);
        alert("Error de conexión con el servidor de AWS. Asegúrate de tener Ktor arrancado.");
    }
}

function cerrarSesion() {
    // Purgamos las credenciales locales de seguridad
    localStorage.clear();
    
    document.getElementById("login-correo").value = "";
    document.getElementById("login-clave").value = "";
    document.getElementById("login-usuario").value = "";
    
    document.getElementById("vista-panel").style.display = "none";
    document.getElementById("vista-login").style.display = "flex";
}

// ... A partir de aquí tu alternarFormularioAuth(e) continúa igual hacia abajo ...
// ==========================================================================
// CONTROL CONMUTADOR AUTH - VERSIÓN COMPACTA
// ==========================================================================
function alternarFormularioAuth(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    const mainTitle = document.getElementById("auth-main-title");
    const inputUser = document.getElementById("login-usuario");
    const btnEntrar = document.getElementById("btn-entrar");
    const txtPregunta = document.getElementById("txt-pregunta");
    const enlaceAuth = document.getElementById("enlace-auth");
    const contenedorForm = document.querySelector(".form-container");

    if (inputUser.style.display === "none") {
        mainTitle.innerText = "Sign Up";
        inputUser.style.display = "block";
        btnEntrar.innerText = "Register Now";
        txtPregunta.innerText = "¿Ya tienes cuenta?";
        enlaceAuth.innerText = "Log in";
        if(contenedorForm) contenedorForm.style.minHeight = "440px";
    } else {
        mainTitle.innerText = "Welcome back";
        inputUser.style.display = "none";
        btnEntrar.innerText = "Log in";
        txtPregunta.innerText = "Don't have an account?";
        enlaceAuth.innerText = "Sign up";
        if(contenedorForm) contenedorForm.style.minHeight = "380px";
    }
}

// ==========================================================================
// CONTROL DE VISIBILIDAD DE CONTRASEÑA NATIVA
// ==========================================================================
function alternarVisibilidadClave() {
    const inputClave = document.getElementById("login-clave");
    const btnOjo = document.getElementById("btn-ver-clave");

    if (inputClave.type === "password") {
        inputClave.type = "text";
        btnOjo.innerText = "🙈"; 
    } else {
        inputClave.type = "password";
        btnOjo.innerText = "👁️";
    }
}

function irAInicio() {
    cambiarSeccionPrincipal("inicio");
}

function cambiarSeccionPrincipal(seccion) {
    seccionPrincipalActual = seccion;
    modoCrudActivo = "lectura";
    
    document.getElementById("sec-inicio").style.display = "none";
    document.getElementById("sec-modulo-operativo").style.display = "none";
    document.getElementById("sec-analisis").style.display = "none";
    document.getElementById("sec-ayuda").style.display = "none";
    document.getElementById("subbar-finanzas").style.display = "none";

    document.querySelectorAll(".enlace-principal").forEach(el => el.classList.remove("activo"));

    if (seccion === "inicio") {
        document.getElementById("nav-inicio").classList.add("activo");
        document.getElementById("sec-inicio").style.display = "block";
        if (typeof calcularBalancesResumen === "function") {
            calcularBalancesResumen();
        }
    } else if (seccion === "movimientos" || seccion === "objetivos") {
        document.getElementById(`nav-${seccion}`).classList.add("activo");
        document.getElementById("sec-modulo-operativo").style.display = "block";
        document.getElementById("subbar-finanzas").style.display = "flex";
        
        let targetSub = (seccion === "movimientos") ? "gastos" : "presupuestos";
        cambiarSubPestana(targetSub);
    } else if (seccion === "analisis") {
        document.getElementById("nav-analisis").classList.add("activo");
        document.getElementById("sec-analisis").style.display = "block";
        if (typeof inicializarModuloGraficos === "function") {
            inicializarModuloGraficos();
        }
    } else if (seccion === "ayuda") {
        document.getElementById("nav-ayuda").classList.add("activo");
        document.getElementById("sec-ayuda").style.display = "block";
    }
}

function cambiarSubPestana(sub) {
    subPestanaActual = sub;
    modoCrudActivo = "lectura";
    
    document.querySelectorAll(".tab-operativo").forEach(btn => btn.classList.remove("activo"));
    document.getElementById(`tab-${sub}`).classList.add("activo");
    
    document.getElementById("titulo-modulo-activo").innerText = `Panel de Control: ${sub.toUpperCase()}`;
    document.getElementById("btn-confirmar-eliminar").style.display = "none";

    if (typeof renderizarListaDinamica === "function") {
        renderizarListaDinamica();
    }
}

function abrirModalCrear() {
    elementoEditandoId = null;
    document.getElementById("modal-titulo").innerText = `Añadir Nuevo: ${subPestanaActual.toUpperCase()}`;
    if (typeof generarCamposFormularioModal === "function") {
        generarCamposFormularioModal();
    }
    document.getElementById("modal-formulario").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal-formulario").style.display = "none";
    modoCrudActivo = "lectura";
    if (typeof renderizarListaDinamica === "function") {
        renderizarListaDinamica();
    }
}

Array.prototype.sumOf = function(selector) { return this.reduce((acum, item) => acum + selector(item), 0); };

window.onload = function() {
    console.log("ZenitApp inicializada y lista.");
};