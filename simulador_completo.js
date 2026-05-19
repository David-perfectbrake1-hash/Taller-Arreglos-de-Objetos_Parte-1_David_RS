// === ESTADO DE LA APLICACIÓN ===
let clientes = [
  {cedula: "123", nombre: "Mario", apellido: "Rojas", direccion: "Avenida", email: "@", telefono: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "456", nombre: "Xavier", apellido: "Rojas", direccion: "Avenida", email: "@", telefono: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "789", nombre: "Dario", apellido: "Rojas", direccion: "Avenida", email: "@", telefono: "xx-xx", ingresos: 1000, egresos: 500}
];
let creditos = [];

let listaContactos = [
  {nombre: "David001", numero: "99001"}, 
  {nombre: "D002", numero: "99002"}, 
  {nombre: "D003", numero: "99003"},
  {cedula: "789", nombre: "Dario", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "456", nombre: "Xavier", apellido: "Rojas", direccion: "Avenida", email: "@", numero: "99004", ingresos: 1000, egresos: 500},
]

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

let montoMaximo = 10000

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

  if(id==="contactos"){
    pintarContactos(listaContactos)
  }
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("direccion", "")
  mostrarTextoEnCaja("email", "")
  mostrarTextoEnCaja("telefono", "")
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
  let telefono = recuperarTexto("telefono")
  let ingresos = recuperarFloat("ingresos");
  let egresos = recuperarFloat("egresos");


  if (!cedula || !nombre || !apellido || !direccion || !email || !telefono || isNaN(ingresos) || isNaN(egresos)) {
    alert("Por favor, completa todos los campos con datos válidos.");
    return;
  }

  let clienteExistente = buscarCliente(cedula);
  if (clienteExistente !== null) {
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.direccion = direccion
    clienteExistente.email = email
    clienteExistente.telefono = telefono
    clienteExistente.ingresos = ingresos;
    clienteExistente.egresos = egresos;
  } else {
    clientes.push({cedula, nombre, apellido, direccion, email, telefono, ingresos, egresos});
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
        <td>${cliente.telefono}</td>
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
    mostrarTextoEnCaja("telefono", encontrado.telefono);
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
  
  // LIMPIEZA DE CONTENEDORES
  document.getElementById("resultadoCredito").innerHTML = "";
  document.getElementById("resultadoCredito").className = ""; // Quita el color verde/animación

  document.getElementById("mensajeEstado").innerHTML = ""; 
  document.getElementById("mensajeEstado").className = ""; // Quita el color azul/animación
  contenedor.innerHTML = "";

  if (encontrado) {
    contenedor.innerHTML = `
      <h3>Datos del Cliente</h3>
      <p><strong>Cédula:</strong> ${encontrado.cedula}</p>
      <p><strong>Nombre:</strong> ${encontrado.nombre}</p>
      <p><strong>Apellido:</strong> ${encontrado.apellido}</p>
      <p><strong>Dirección:</strong> ${encontrado.direccion}</p>
      <p><strong>E-mail:</strong> ${encontrado.email}</p>
      <p><strong>Telefono:</strong> ${encontrado.telefono}</p>
      <p><strong>Ingresos:</strong> ${encontrado.ingresos}</p>
      <p><strong>Egresos:</strong> ${encontrado.egresos}</p>`;
    clienteSeleccionado = encontrado;
  } else {
    contenedor.innerHTML = "<p>Cliente no encontrado</p>";
    clienteSeleccionado = null;
  }
}

function buscarCreditos(cedula) {
  if (!cedula) {
    return [];
  }

  let resultados = [];
  for (let credito of creditos) {
    if (credito.cedula === cedula) {
      resultados.push(credito);
    }
  }
  return resultados;
}

function pintarCreditos(creditos) {
  let tbody = document.getElementById("tablaCreditos");
  tbody.innerHTML = "";

  if (!creditos || creditos.length === 0) {
    tbody.innerHTML = 
      `<tr><td colspan="11" style="text-align:center;">
        No hay créditos registrados.
      </td></tr>`;
    return;
  }

  for (let credito of creditos) {
    tbody.innerHTML += `
      <tr>
        <td>${credito.cedula}</td>
        <td>${credito.nombre}</td>
        <td>${credito.apellido}</td>
        <td>${credito.direccion}</td>
        <td>${credito.email}</td>
        <td>${credito.telefono}</td>
        <td>${credito.monto}</td>
        <td>${credito.tasa}%</td>
        <td>${credito.plazo}</td>
        <td>${credito.cuota.toFixed(2)}</td>
        <td>
          <button onclick="eliminarCredito(${credito.id}, '${credito.cedula}')">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }
}

function eliminarCredito(id, cedula) {
  if (!confirm(`¿Eliminar el crédito asociado a la cédula: ${cedula}?`)) return;

  for (let credito of creditos) {
    if (credito.id === id) {
      creditos.splice(creditos.indexOf(credito), 1);
      break; 
    }
  }

  pintarCreditos(creditos);
}

function buscarCreditosCliente() {
  let cedula = recuperarTexto("buscarCedulaListado");
  if (!cedula || cedula.trim() === "") {
    alert("Por favor, ingrese una cédula válida.");
    return;
  }

  let resultados = buscarCreditos(cedula);
  pintarCreditos(resultados);
}

function calcularCredito() {
  document.getElementById("mensajeEstado").innerHTML = "";
  document.getElementById("mensajeEstado").className = "";
  //Si clienteSeleccionado ESTÁ VACÍO (es null), entonces ejecuta esto
  if (!clienteSeleccionado)
    return alert("Ingrese un número de cédula en Buscar cliente.");
  
  let monto = recuperarFloat("montoCredito");
  let plazo = recuperarFloat("plazoCredito");

  if (monto > montoMaximo) {
      alert(
        "Error: El monto solicitado supera el máximo permitido ($" + montoMaximo + ")"
      );
      mostrarTextoEnCaja("montoCredito", "")
      return
  }

  if (isNaN(monto) || monto <= 0 || isNaN(plazo) || plazo <= 0) 
    return alert("Datos inválidos: Ingrese monto y plazo.");

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
  
  let btnSolicitar = document.getElementById("btnSolicitarCredito");
  let btnAsignar   = document.getElementById("btnAsignarCredito");
    if (aprobar) {
      // Si fue aprobado: habilita SOLO solicitar, asignar sigue deshabilitado
      btnSolicitar.disabled = false;
      btnAsignar.disabled   = true; 
    } else {
      // Si fue rechazado: ambos permanecen deshabilitados
      btnSolicitar.disabled = true;
      btnAsignar.disabled   = true;
    }
}

function solicitarCredito() {
  // Si no hay cliente o no hay crédito aprobado, muestra error y detiene la función
  if (!clienteSeleccionado || !creditoAprobado) {
    let resultado = document.getElementById("resultadoCredito");
    resultado.innerHTML = "⚠️ No se puede solicitar: crédito no aprobado.";
    resultado.className = "rechazado";
    return;
  }

  // Cambiar visualmente el estado
  let resultado = document.getElementById("mensajeEstado");
  resultado.innerHTML = `
    <div class="mensaje-proceso">
      <strong>✅ Solicitud en proceso...</strong><br>
      <p>Presione el botón <b>"Asignar Crédito"</b> para completar el registro.</p>
    </div>
  `;
  resultado.className = "proceso";

  // Gestión de botones
  let btnAsignar = document.getElementById("btnAsignarCredito");
  let btnSolicitar = document.getElementById("btnSolicitarCredito");

  if (btnAsignar) {
    btnAsignar.disabled = false; // Habilitamos btnAsignar
    btnAsignar.style.backgroundColor = "#2ecc71";
    btnAsignar.style.fontWeight = "bold";
  }
  
  if (btnSolicitar) {
    btnSolicitar.disabled = true; // Deshabilitamos el actual para evitar duplicados
  }
}

function asignarCredito() {
  // Validación de seguridad: solo procede si hay cliente y crédito aprobado
  if (!clienteSeleccionado || !creditoAprobado) {
    alert("No se puede asignar: crédito no aprobado o cliente no seleccionado.");
    return;
  }

  // Crear el objeto con la estructura exacta del taller
  let credito = {
    id: Date.now(), //Genera un número único por cada crédito
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    apellido: clienteSeleccionado.apellido,
    direccion: clienteSeleccionado.direccion,
    email: clienteSeleccionado.email,
    telefono: clienteSeleccionado.telefono,
    monto: montoCalculado,
    tasa: tasaInteres,
    plazo: plazoCalculado,
    cuota: cuotaCalculada
  };

  // Agregar al arreglo global
  creditos.push(credito);

  alert(`✅ Crédito asignado exitosamente a ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`);
  
  console.log("Créditos registrados:", creditos);
}

/*
---------------REPASO CLASE--------------------
*/
function pintarContactos(listaContactos) {
  let tbody = document.getElementById("tablaContactos");
  tbody.innerHTML = "";
  for (let contacto of listaContactos) {
    tbody.innerHTML += `
      <tr>
        <td>${contacto.nombre}</td>
        <td>${contacto.numero}</td>
      </tr>`;
  }
}

function buscarContactos(filtro){
  let cmpFiltro = recuperarTexto("buscarContacto")
  let filtroContactos = []
  if(filtro=="nombre"){
    for(let i = 0; i < listaContactos.length; i++){
      let contacto = listaContactos[i]
        if (contacto.nombre == cmpFiltro){
          filtroContactos.push(contacto)
        }
    }
    pintarContactos(filtroContactos)
  }

  if(filtro=="numero"){
    for(let i = 0; i < listaContactos.length; i++){
      let contacto = listaContactos[i]
        if (contacto.numero == cmpFiltro){
          filtroContactos.push(contacto)
        }
    }
    pintarContactos(filtroContactos)
  }
}

function ordenarPorNombre(){
  let contactosOrdenados = []
    contactosOrdenados = listaContactos.slice().sort(
      (a,b)=>a.nombre.localeCompare(b.nombre)
    )
    pintarContactos(contactosOrdenados)
}

function guardarMontoMaximo() {
    let valor = recuperarFloat("inputMontoMaximo")
    if (valor > 0) {
        montoMaximo = valor
        alert("Monto máximo actualizado a: " + montoMaximo)
    } else {
        alert("Ingrese un monto válido")
    }
}

function mostrarVIP() {
    let creditosVIP = []
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].monto > 5000) {
            creditosVIP.push(creditos[i])
        }
    }
    
    if (creditosVIP.length === 0) {
        alert("No hay créditos VIP (mayores a $5000) registrados.")
    }
    
    pintarCreditos(creditosVIP)
    mostrarSeccion('listaCreditos')
}

function mostrarAcercaDe() {
    alert("Desarrollado por: David RS\n" +
          "Carrera: Desarrollo de Software\n" +
          "Instituto: Instituto Movilis\n" +
          "Frase: 'Sí se puede.'")
}