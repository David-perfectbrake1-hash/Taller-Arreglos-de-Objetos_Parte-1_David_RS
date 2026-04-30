
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
  const SECCIONES = document.querySelectorAll("section");

  // 2. Iniciamos un bucle para revisar la lista 'SECCIONES' de una en una.
  //    En cada vuelta, la sección actual se llamará 'seccion'.
  for (let seccion of SECCIONES) {
    
    // 3. De la sección que tenemos en la mano en esta vuelta, 
    //    entramos a su lista de clases y eliminamos "activa".
    //    Si no la tiene, no pasa nada; si la tiene, se borra.
    seccion.classList.remove("activa");
    
  } // 4. El bucle se repite hasta que ya no queden más secciones en la lista.
}

function mostrarSeccion(id){
  ocultarSecciones()
  document.getElementById(id).classList.add("activa")
}

function guardarTasa() {
  // 1. Obtener el valor del input (es un string)
  let input = document.getElementById("tasaInteres");
  // 2. Convertir a número
  let valor = Number(input.value); 

  // 2. Validar el rango (entre 10 y 20)
  if (valor >= 10 && valor <= 20) {
    // Si es válido, mostramos mensaje de éxito
    document.getElementById("mensajeTasa").innerText = 
    "Tasa configurada correctamente: " + valor + "%";
  } else {
    // Si no, mostramos el error
    document.getElementById("mensajeTasa").innerText = 
    "La tasa debe estar entre 10% y 20%";
  }
}