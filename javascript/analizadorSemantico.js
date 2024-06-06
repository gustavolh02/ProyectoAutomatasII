function analizadorSemantico(arbol) {
  let errorEncontrado = ""; // Reiniciar mensajes de error

  let resultado1 = multipleDeclaration();
  let resultado2 = reservedIdentifier();

  if (resultado1 === false || resultado2 === false) {
      errorSemantico(errorEncontrado);
  } else {
      errorSemantico("Análisis semántico completado sin errores.");
  }

  return {
      errores: errorEncontrado
  };
}

function multipleDeclaration() {
  let variablesRepetidas = [];
  for (let variable of tablaDeVariables) {
      if (variablesRepetidas.includes(variable.nombre)) {
          errorEncontrado = "Error Semántico: Múltiple declaración de la variable " + variable.nombre;
          return false;
      } else {
          variablesRepetidas.push(variable.nombre);
      }
  }
  return true;
}

function reservedIdentifier() {
  let nombresDeVariables = []; // Asegúrate de que esto es un array
  for (let variable of tablaDeVariables) {
      nombresDeVariables.push(variable.nombre);
  }

  for (let metodo of tablaDeFunciones) {
      if (["tauto", "contra", "deci"].includes(metodo.tipo)) {
          let expresion = metodo.sentencias[0][0];
          if (!evaluarExpresionLogica(expresion, nombresDeVariables)) {
              errorEncontrado += "Error Semántico: Expresión lógica inválida en la función " + metodo.tipo + " en la línea " + metodo.linea + "\n";
          }
      }
  }

  return errorEncontrado === "";
}

function evaluarExpresionLogica(expresion, nombresDeVariables) {
  let stack = [];
  for (let tokenObj of expresion) {
      let token = tokenObj.token;

      if (["1", "0"].includes(token) || (Array.isArray(nombresDeVariables) && nombresDeVariables.includes(token))) {
          stack.push(token);
      } else if (["*", "+", "->", "<->"].includes(token)) {
          let operando2 = stack.pop();
          let operando1 = stack.pop();
          if (operando1 === undefined || operando2 === undefined) {
              return false;
          }
          let resultado = eval(operando1 + token + operando2);
          stack.push(resultado ? "1" : "0");
      } else if (token === "-") {
          let operando = stack.pop();
          if (operando === undefined) {
              return false;
          }
          let resultado = eval(token + operando);
          stack.push(resultado ? "1" : "0");
      } else {
          return false;
      }
  }

  return stack.length === 1;
}

function errorSemantico(error) {
  let erroresSemanticosTextArea = document.getElementById("erroresSemanticos");
  erroresSemanticosTextArea.style.borderColor = "red";
  erroresSemanticosTextArea.style.color = "red";
  erroresSemanticosTextArea.style.fontWeight = "bold";
  erroresSemanticosTextArea.value = error;
  console.error(error);
}

// Hacer la función accesible desde fuera del archivo
window.analizadorSemantico = analizadorSemantico;
