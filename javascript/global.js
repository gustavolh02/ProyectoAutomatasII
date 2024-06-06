// Variables Globales para trabajar nuestro lenguaje de programacion
var tablaDeSimbolos = [];
var numberOfLines;
var tablaDeVariables = [];
var tablaDeFunciones = [];

// Función para limpiar la consola de errores Sintacticos
function limpiarFlujoDeTrabajo() {
  // Limpiando valores y arreglos
  var erroresSintacticos = document.getElementById("erroresSintacticos");
  if (erroresSintacticos) {
    erroresSintacticos.value = "";
  }
  
  var erroresSemanticos = document.getElementById("erroresSemanticos");
  if (erroresSemanticos) {
    erroresSemanticos.value = "";
  }

  tablaDeFunciones = [];
  tablaDeVariables = [];
  tablaDeSimbolos = [];
  numberOfLines = 0;

  // Limpiando tablas
  limpiarTabla("tablaDeDatos");
  limpiarTabla("tablaDeSimbolos");

  // Limpiando consola (Si existe una consola en el DOM)
  var consola = document.getElementById("consola");
  if (consola) {
    consola.value = "";
  }
}

// Función para limpiar una tabla por su id
function limpiarTabla(idTabla) {
  var tabla = document.getElementById(idTabla);
  if (tabla) {
    var rowCount = tabla.rows.length;

    // Eliminando filas de la tabla (excepto el encabezado)
    for (var i = rowCount - 1; i > 0; i--) {
      tabla.deleteRow(i);
    }
  }
}
