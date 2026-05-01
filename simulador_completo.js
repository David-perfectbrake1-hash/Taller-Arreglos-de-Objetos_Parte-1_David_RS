
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;

  
//Para recuperar o mostrar información 
// usar los métodos de la clase utilitarios, 
// puede agregar métodos adicionales en utilitarios

/**
 * Función para ocultar todas las secciones del simulador.
 * Se usa antes de mostrar una sección específica para evitar 
 * que se vean varias al mismo tiempo.
 */
function ocultarSecciones() {
  // 1. Buscamos en el HTML todos los elementos que sean etiquetas <section>
  //    y los guardamos en una lista llamada 'secciones'.
  const SECCIONES = document.querySelectorAll("section")

  // 2. Iniciamos un bucle para revisar la lista 'SECCIONES' de una en una.
  //    En cada vuelta, la sección actual se llamará 'seccion'.
  for (let seccion of SECCIONES) {
    
    // 3. De la sección que tenemos en la mano en esta vuelta, 
    //    entramos a su lista de clases y eliminamos "activa".
    //    Si no la tiene, no pasa nada; si la tiene, se borra.
    seccion.classList.remove("activa")
    
  } // 4. El bucle se repite hasta que ya no queden más secciones en la lista.
}

function mostrarSeccion(id){
  ocultarSecciones()
  document.getElementById(id).classList.add("activa")
}

function guardarTasa() {
  let valor = recuperarInt("tasaInteres")

  if (valor >= 10 && valor <= 20) {
    // Actualiza la variable global
    tasaInteres = valor
    // Si es válido, mostramos mensaje de éxito
    mostrarTexto("Tasa configurada correctamente: " + valor + "%")
  } else {
    // Si no, mostramos el error
    mostrarTexto("La tasa debe estar entre 10% y 20%")
  }
}

function guardarCliente() {
  // Obtener datos del formulario
  let cedula = recuperarTexto("cedula")
  let nombre = recuperarTexto("nombre")
  let apellido = recuperarTexto("apellido")
  let ingresos = recuperarFloat("ingresos")
  let egresos = recuperarFloat("egresos")
  
  // Verificar si ya existe un cliente con esa cédula
  let clienteExistente = buscarCliente(cedula)

  if (clienteExistente !== null) {
      // Si Existe ACTUALIZAR (sin cambiar la cédula)
      clienteExistente.nombre = nombre
      clienteExistente.apellido = apellido
      clienteExistente.ingresos = ingresos
      clienteExistente.egresos = egresos
      
      // Limpiar la selección después de actualizar
      clienteSeleccionado = null
    } else {
      // Si No existe CREAR nuevo cliente
      let nuevoCliente = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        ingresos: ingresos,
        egresos: egresos
      };
      clientes.push(nuevoCliente)
    }

    // Actualizar la tabla y limpiar el formulario
    pintarClientes()
    limpiar()
}

function pintarClientes() {
  // 1. Obtener el cuerpo de la tabla
  let tbody = document.getElementById("tablaClientes")
  
  // 2. Limpiar contenido anterior
  tbody.innerHTML = ""

  // 3. Recorrer el arreglo de clientes
  for (let cliente of clientes) {
    let fila = `
      <tr>
        <td>${cliente.cedula}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.apellido}</td>
        <td>${cliente.ingresos}</td>
        <td>${cliente.egresos}</td>
        <td>
            <button onclick="seleccionarCliente('${cliente.cedula}')">Actualizar</button>
        </td>
      </tr>
    `

    // 4. Insertamos la fila en el HTML
    tbody.innerHTML += fila
  }
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "")
  mostrarTextoEnCaja("nombre", "")
  mostrarTextoEnCaja("apellido", "")
  mostrarTextoEnCaja("ingresos", "")
  mostrarTextoEnCaja("egresos", "")
}

function buscarCliente(cedula) {
  for (let cliente of clientes) {
    if (cliente.cedula === cedula) {
      return cliente // retorna el objeto cliente si lo encuentra
    }
  }
  return null // retorna null si NO lo encuentra
}

function seleccionarCliente(cedula) {
  // 1. Buscar el cliente
  let clienteEncontrado = buscarCliente(cedula)
  
  // 2. Guardarlo en clienteSeleccionado (variable global)
  clienteSeleccionado = clienteEncontrado
  
  // 3. Mostrar datos en los inputs (solo si se encontró)
  if (clienteEncontrado !== null) {
    mostrarTextoEnCaja("cedula", clienteEncontrado.cedula)
    mostrarTextoEnCaja("nombre", clienteEncontrado.nombre)
    mostrarTextoEnCaja("apellido", clienteEncontrado.apellido)
    mostrarTextoEnCaja("ingresos", clienteEncontrado.ingresos)
    mostrarTextoEnCaja("egresos", clienteEncontrado.egresos)
  }
}