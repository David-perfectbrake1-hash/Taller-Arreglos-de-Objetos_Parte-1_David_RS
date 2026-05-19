let clientes = [
  {cedula: "123", nombre: "Mario", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "456", nombre: "Xavier", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500},
  {cedula: "789", nombre: "Dario", apellido: "Rojas", direccion: "Avenida", email: "@", contacto: "xx-xx", ingresos: 1000, egresos: 500}
];

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

function pintarClientes(){
    let tbody = document.getElementById("tablaClientes")
    tbody.innerHTML = ""

    for(let cliente of clientes){
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
        </tr>
        `
    }
}

function guardarCliente (){
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
    // Actualización de datos
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.direccion = direccion
    clienteExistente.email = email
    clienteExistente.contacto = contacto
    clienteExistente.ingresos = ingresos;
    clienteExistente.egresos = egresos;
  } else {
    // Nuevo cliente con push
    clientes.push({cedula, nombre, apellido, direccion, email, contacto, ingresos, egresos})
  }
  pintarClientes()
  limpiar()
}

function buscarCliente(cedula){
    for(let cliente of clientes){
        if(cliente.cedula === cedula){
            return cliente
        }
    }
    return null
}

document.addEventListener("DOMContentLoaded", function() {
    pintarClientes();
})