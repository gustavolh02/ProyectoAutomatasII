let errorEncontrado = "";
let codigoIntermedio = [];

function analizadorSintactico(tokens) {
    limpiarErrores(); // Limpiar errores anteriores

    let arbol = [];  // Aquí se almacena el árbol sintáctico
    codigoIntermedio = []; // Reiniciar el código intermedio

    if (tokens.length > 0) {
        let pos = 0;
        while (pos < tokens.length) {
            let sentencia = obtenerSentencia(tokens, pos);
            pos = sentencia[1]; // Actualiza la posición después de la sentencia
            let resultadoAnalisis = analizarSentencia(sentencia[0]); // Analiza la sentencia
            if (!resultadoAnalisis) {
                // Si hay un error en la sentencia, acumularlo en errorEncontrado
                errorEncontrado += `Error en la línea ${sentencia[0][0].linea}: ${errorEncontrado}\n`;
            } else {
                arbol.push(sentencia[0]); // Agregar la sentencia al árbol
            }
        }
    }
    mostrarErrores(); // Mostrar los errores acumulados

    return {
        errores: errorEncontrado,
        arbol: arbol,
        codigoIntermedio: codigoIntermedio
    };
}

function mostrarErrores() {
    let erroresTextArea = document.getElementById("erroresSintacticos");
    erroresTextArea.value = errorEncontrado;
}

function limpiarErrores() {
    errorEncontrado = "";
    let erroresTextArea = document.getElementById("erroresSintacticos");
    erroresTextArea.value = ""; // Limpiar el contenido del textarea
}

function obtenerSentencia(tabla, pos) {
    let sentencia = [];
    while (pos < tabla.length && tabla[pos].opCode !== "END") {
        sentencia.push(tabla[pos]);
        pos++;
    }
    if (pos < tabla.length && tabla[pos].opCode === "END") {
        pos++; // Avanza después del fin de la sentencia
    }
    return [sentencia, pos];
}

function sentenciaAsignacion(sentencia, pos) {
    if (sentencia[pos].opCode == "IDENTIFICADOR") {
        let identificador = sentencia[pos].token;
        pos++;
        if (sentencia[pos].opCode == "ASIGNACION") {
            pos++;
            const [evaluaExpresion, valorExpresion, nuevaPosicion] = evaluarExpresionLogica(sentencia, pos);
            if (evaluaExpresion) {
                pos = nuevaPosicion;
                codigoIntermedio.push(`${identificador} = ${valorExpresion.join(' ')}`);
                return true;
            } else {
                errorEncontrado += `Error en la asignación, la expresión lógica es inválida. Error en la línea ${sentencia[pos].linea}`;
                return false;
            }
        } else {
            errorEncontrado += `Se esperaba el operador de asignación '=' después del identificador. Error en la línea ${sentencia[pos].linea}`;
            return false;
        }
    } else {
        errorEncontrado += `Se esperaba un identificador para la asignación. Error en la línea ${sentencia[pos].linea}`;
        return false;
    }
}

function analizarSentencia(sentencia) {
    switch (sentencia[0].opCode) {
        case "IDENTIFICADOR":
            return sentenciaAsignacion(sentencia, 0);
        case "FUNCION_WRITELOG":
            return sentenciaImpresionLogica(sentencia, 0);
        case "FUNCION_WRITESTR":
            return sentenciaImpresionCadena(sentencia, 0);
        case "FUNCION_WRITEINTRO":
            return sentenciaImpresionRetorno(sentencia, 0);
        case "FUNCION_WRITETABLE":
            return sentenciaImpresionTablaVerdad(sentencia, 0);
        default:
            errorEncontrado += `Sentencia no válida. Error en la línea ${sentencia[0].linea}`;
            return false;
    }
}

function sentenciaImpresionLogica(sentencia, pos) {
    if (sentencia[pos].opCode == "FUNCION_WRITELOG") {
        pos++;
        if (sentencia[pos].opCode == "LPAREN") {
            pos++;
            const [evaluaExpresion, valorExpresion, nuevaPosicion] = evaluarExpresionLogica(sentencia, pos);
            if (evaluaExpresion) {
                pos = nuevaPosicion;
                if (sentencia[pos].opCode == "RPAREN") {
                    pos++;
                    codigoIntermedio.push(`writelog(${valorExpresion.join(' ')})`);
                    return true;
                } else {
                    errorEncontrado += `Se esperaba ')' después de la expresión lógica. Error en la línea ${sentencia[pos].linea}`;
                    return false;
                }
            } else {
                errorEncontrado += `Error en la expresión lógica dentro de writelog(). Error en la línea ${sentencia[pos].linea}`;
                return false;
            }
        } else {
            errorEncontrado += `Se esperaba '(' después de writelog(). Error en la línea ${sentencia[pos].linea}`;
            return false;
        }
    } else {
        errorEncontrado += `Se esperaba la función writelog(). Error en la línea ${sentencia[pos].linea}`;
        return false;
    }
}

function sentenciaImpresionCadena(sentencia, pos) {
    if (sentencia[pos].opCode == "FUNCION_WRITESTR") {
        pos++;
        if (sentencia[pos].opCode == "LPAREN") {
            pos++;
            if (sentencia[pos].opCode == "STRING") {
                let cadena = sentencia[pos].token;
                pos++;
                if (sentencia[pos].opCode == "RPAREN") {
                    pos++;
                    codigoIntermedio.push(`writestr(${cadena})`);
                    return true;
                } else {
                    errorEncontrado += `Se esperaba ')' después de la cadena. Error en la línea ${sentencia[pos].linea}`;
                    return false;
                }
            } else {
                errorEncontrado += `Se esperaba una cadena dentro de writestr(). Error en la línea ${sentencia[pos].linea}`;
                return false;
            }
        } else {
            errorEncontrado += `Se esperaba '(' después de writestr(). Error en la línea ${sentencia[pos].linea}`;
            return false;
        }
    } else {
        errorEncontrado += `Se esperaba la función writestr(). Error en la línea ${sentencia[pos].linea}`;
        return false;
    }
}

function sentenciaImpresionRetorno(sentencia, pos) {
    if (sentencia[pos].opCode == "FUNCION_WRITEINTRO") {
        pos++;
        codigoIntermedio.push(`writeintro()`);
        return true;
    } else {
        errorEncontrado += `Se esperaba la función writeintro(). Error en la línea ${sentencia[pos].linea}`;
        return false;
    }
}

function sentenciaImpresionTablaVerdad(sentencia, pos) {
    if (sentencia[pos].opCode == "FUNCION_WRITETABLE") {
        pos++;
        if (sentencia[pos].opCode == "LPAREN") {
            pos++;
            const [evaluaExpresion, valorExpresion, nuevaPosicion] = evaluarExpresionLogica(sentencia, pos);
            if (evaluaExpresion) {
                pos = nuevaPosicion;
                if (sentencia[pos].opCode == "RPAREN") {
                    pos++;
                    codigoIntermedio.push(`writetable(${valorExpresion.join(' ')})`);
                    return true;
                } else {
                    errorEncontrado += `Se esperaba ')' después de la expresión lógica. Error en la línea ${sentencia[pos].linea}`;
                    return false;
                }
            } else {
                errorEncontrado += `Error en la expresión lógica dentro de writetable(). Error en la línea ${sentencia[pos].linea}`;
                return false;
            }
        } else {
            errorEncontrado += `Se esperaba '(' después de writetable(). Error en la línea ${sentencia[pos].linea}`;
            return false;
        }
    } else {
        errorEncontrado += `Se esperaba la función writetable(). Error en la línea ${sentencia[pos].linea}`;
        return false;
    }
}

function evaluarExpresionLogica(sentencia, pos) {
    const expresion = [];
    while (pos < sentencia.length) {
        if (sentencia[pos].opCode == "IDENTIFICADOR" || sentencia[pos].opCode == "NUMERO" || sentencia[pos].opCode == "OPERADOR_LOGICO" || sentencia[pos].opCode == "OPERADOR_ARITMETICO") {
            expresion.push(sentencia[pos]);
            pos++;
        } else if (sentencia[pos].opCode == "LPAREN") {
            pos++;
            const [evaluaExpresion, valorExpresion, nuevaPosicion] = evaluarExpresionLogica(sentencia, pos);
            if (evaluaExpresion) {
                expresion.push({
                    opCode: "PARENTESIS",
                    token: "(",
                });
                pos = nuevaPosicion;
            } else {
                return [false, null, null];
            }
        } else if (sentencia[pos].opCode == "RPAREN") {
            expresion.push({
                opCode: "PARENTESIS",
                token: ")",
            });
            return [true, expresion, pos + 1];
        } else {
            errorEncontrado += `Error en la expresión lógica. Error en la línea ${sentencia[pos].linea}`;
            return [false, null, null];
        }
    }
    return [true, expresion, pos];
}

// Hacer la función accesible desde fuera del archivo
window.evaluarExpresionLogica = evaluarExpresionLogica;
window.analizadorSintactico = analizadorSintactico;
