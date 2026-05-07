// === ESTADO DE LA APLICACIÓN ===
let clientes = [
  {cedula: "123", nombre: "Mario", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "456", nombre: "Xavier", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "789", nombre: "Dario", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500}
];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

// === NAVEGACIÓN Y UI ===
function ocultarSecciones() {
  const SECCIONES = document.querySelectorAll("section");
  for (let seccion of SECCIONES) {
    seccion.classList.remove("activa");
  }
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("direccion", "")
  mostrarTextoEnCaja("email", "")
  mostrarTextoEnCaja("contacto", "")
  mostrarTextoEnCaja("ingresos", "");
  mostrarTextoEnCaja("egresos", "");
  mostrarTextoEnCaja("montoCredito", "");
  mostrarTextoEnCaja("plazoCredito", "");
}

// === GESTIÓN DE CLIENTES ===
function buscarCliente(cedula) {
  for (let cliente of clientes) {
    if (cliente.cedula === cedula) return cliente;
  }
  return null;
}

function guardarCliente() {
  let cedula = recuperarTexto("cedula");
  let nombre = recuperarTexto("nombre");
  let apellido = recuperarTexto("apellido");
  let direccion = recuperarTexto("direccion");
  let email = recuperarTexto("email")
  let contacto = recuperarTexto("contacto")
  let ingresos = recuperarFloat("ingresos");
  let egresos = recuperarFloat("egresos");


  if (!cedula || !nombre || !apellido || !direccion || !email || !contacto || isNaN(ingresos) || isNaN(egresos)) {
    alert("Por favor, completa todos los campos con datos válidos.");
    return;
  }

  let clienteExistente = buscarCliente(cedula);
  if (clienteExistente !== null) {
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.direccion = direccion
    clienteExistente.email = email
    clienteExistente.contacto = contacto
    clienteExistente.ingresos = ingresos;
    clienteExistente.egresos = egresos;
  } else {
    clientes.push({cedula, nombre, apellido, direccion, email, contacto, ingresos, egresos});
  }
  pintarClientes();
  limpiar();
}

function pintarClientes() {
  let tbody = document.getElementById("tablaClientes");
  tbody.innerHTML = "";
  for (let cliente of clientes) {
    tbody.innerHTML += `
      <tr>
        <td>${cliente.cedula}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.apellido}</td>
        <td>${cliente.direccion}</td>
        <td>${cliente.email}</td>
        <td>${cliente.contacto}</td>
        <td>${cliente.ingresos}</td>
        <td>${cliente.egresos}</td>
        <td><button onclick="seleccionarCliente('${cliente.cedula}')">Actualizar</button></td>
        <td><button onclick="eliminarCliente('${cliente.cedula}')">Eliminar</button></td>
      </tr>`;
  }
}

function seleccionarCliente(cedula) {
  let encontrado = buscarCliente(cedula);
  clienteSeleccionado = encontrado;
  if (encontrado) {
    mostrarTextoEnCaja("cedula", encontrado.cedula);
    mostrarTextoEnCaja("nombre", encontrado.nombre);
    mostrarTextoEnCaja("apellido", encontrado.apellido);
    mostrarTextoEnCaja("direccion", encontrado.direccion)
    mostrarTextoEnCaja("email", encontrado.email);
    mostrarTextoEnCaja("contacto", encontrado.contacto);
    mostrarTextoEnCaja("ingresos", encontrado.ingresos);
    mostrarTextoEnCaja("egresos", encontrado.egresos);
  }
}

function eliminarCliente(cedula) {
    if (confirm(`¿Estás seguro de eliminar al cliente con cédula: ${cedula} ?`)) {
        for (let cliente of clientes) {
            if (cliente.cedula === cedula) {
                clientes.splice(clientes.indexOf(cliente), 1);                
                break; 
            }
        }
        pintarClientes();
        limpiar();
    }
}

// === LÓGICA DE PROGRAMACIÓN (CÁLCULOS) ===
function calcularDisponible(ingresos, egresos) {
  let resultado = ingresos - egresos;
  return resultado < 0 //(if) resultado es menor a 0
    ? 0 //retorna 0
    : resultado; //(else) retorna resultado
}

function calcularCapacidadPago(montoDisponible) {
  return montoDisponible * 0.5;
}

function calcularInteresSimple(monto, tasa, plazoAnios) {
  return plazoAnios * monto * (tasa / 100);
}

function calcularTotalPagar(monto, interes) {
  return monto + interes + 100;
}

function calcularCuotaMensual(total, plazoAnios) {
  return total / (plazoAnios * 12);
}

function aprobarCredito(capacidadPago, cuotaMensual) {
  return capacidadPago > cuotaMensual; //(true o false) retorna un valor booleano.
}

// === PROCESO DE CRÉDITO ===
function guardarTasa() {
  let valor = recuperarInt("tasaInteres");
  if (valor >= 10 && valor <= 20) {
    tasaInteres = valor;
    mostrarTexto("mensajeTasa", "Tasa configurada: " + valor + "%");
  } else {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
  }
}

function buscarClienteCredito() {
  let cedula = recuperarTexto("buscarCedulaCredito");
  let encontrado = buscarCliente(cedula); //recibe cedula de recuperarTexto("buscarCedulaCredito")
  let contenedor = document.getElementById("datosClienteCredito");
  mostrarTextoEnCaja("montoCredito", "");
  mostrarTextoEnCaja("plazoCredito", "");
  document.getElementById("resultadoCredito").innerHTML = "";
  contenedor.innerHTML = "";

  if (encontrado) {
    contenedor.innerHTML = `
      <h3>Datos del Cliente</h3>
      <p><strong>Cédula:</strong> ${encontrado.cedula}</p>
      <p><strong>Nombre:</strong> ${encontrado.nombre}</p>
      <p><strong>Apellido:</strong> ${encontrado.apellido}</p>
      <p><strong>Dirección:</strong> ${encontrado.direccion}</p>
      <p><strong>E-mail:</strong> ${encontrado.email}</p>
      <p><strong>Contacto:</strong> ${encontrado.contacto}</p>
      <p><strong>Ingresos:</strong> ${encontrado.ingresos}</p>
      <p><strong>Egresos:</strong> ${encontrado.egresos}</p>`;
    clienteSeleccionado = encontrado;
  } else {
    contenedor.innerHTML = "<p>Cliente no encontrado</p>";
    clienteSeleccionado = null;
  }
}

function calcularCredito() {
  //Si clienteSeleccionado ESTÁ VACÍO (es null), entonces ejecuta esto
  if (!clienteSeleccionado)
    return alert("Selecciona un cliente primero.");
  
  let monto = recuperarFloat("montoCredito");
  let plazo = recuperarFloat("plazoCredito");
  if (isNaN(monto) || monto <= 0 || isNaN(plazo) || plazo <= 0) 
    return alert("Datos inválidos.");

  let disponible = calcularDisponible(clienteSeleccionado.ingresos, clienteSeleccionado.egresos);
  let capacidad = calcularCapacidadPago(disponible);
  let interes = calcularInteresSimple(monto, tasaInteres, plazo);
  let total = calcularTotalPagar(monto, interes);
  let cuota = calcularCuotaMensual(total, plazo);
  let aprobar = aprobarCredito(capacidad, cuota);

  // Se COPIA a variables GLOBALES 
  // Para que OTRAS funciones puedan usarlo después ej. solicitarCredito()
  montoCalculado = monto;
  plazoCalculado = plazo;
  cuotaCalculada = cuota;
  creditoAprobado = aprobar;

  mostrarResultado(capacidad, total, cuota, aprobar);
}

function mostrarResultado(capacidad, total, cuota, aprobar) {
  let resultado = document.getElementById("resultadoCredito");
  resultado.innerHTML = `
    Capacidad de pago: ${capacidad.toFixed(2)}<br>
    Total a pagar: ${total.toFixed(2)}<br>
    Cuota mensual: ${cuota.toFixed(2)}<br>
    RESULTADO: ${aprobar //(if) aprobar es true
      ? "APROBADO" // muestra "APROBADO"
      : "RECHAZADO"}`; //(else) muestra "RECHAZADO"
  resultado.className = aprobar //(if) aprobar es true
    ? "aprobado"  // <div class="aprobado">
    : "rechazado"; // (else) <div class="rechazado">
  
  let boton = document.getElementById("btnSolicitarCredito");
    if (aprobar === true) {
      boton.disabled = false; 
    } else {
      boton.disabled = true;
    }
}

function solicitarCredito() {
      //Si NO hay cliente seleccionado 
      // O el crédito NO fue aprobado 
      // SALIR de la función inmediatamente.
  if (!clienteSeleccionado || !creditoAprobado) return;
  creditos.push({
    cedula: clienteSeleccionado.cedula,
    monto: montoCalculado,
    cuota: cuotaCalculada
  });
  alert("Crédito solicitado con éxito.");
}