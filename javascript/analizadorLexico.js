// analizadorLexico.js

function analizadorLexico(codigo) {
    let tablaDeSimbolos = [];
    let numberOfLines = 0;

    function tokenConstructor(lineasCodigo) {
        for (var i = 0; i < lineasCodigo.length; i++) {
            let linea = lineasCodigo[i].trim();

            if (linea.startsWith("#")) {
                continue;
            }

            let tokens = linea.split(" ");

            for (var j = 0; j < tokens.length; j++) {
                let token = tokens[j].trim();

                switch (token) {
                    case "=":
                        construirTablaDeSimbolos(i + 1, j + 1, "Asignacion", "=", "ASIGNACION");
                        break;
                    case "->":
                        construirTablaDeSimbolos(i + 1, j + 1, "Operador Logico", "->", "OPERADOR_LOGICO");
                        break;
                    case "<->":
                        construirTablaDeSimbolos(i + 1, j + 1, "Operador Logico", "<->", "OPERADOR_LOGICO");
                        break;
                    case "+":
                    case "-":
                    case "*":
                    case "/":
                    case "%":
                        construirTablaDeSimbolos(i + 1, j + 1, "Operador Logico", token, "OPERADOR_LOGICO");
                        break;
                    case "tauto":
                        construirTablaDeSimbolos(i + 1, j + 1, "Palabra Reservada", token, "TAUTOLOGIA");
                        break;
                    case "contra":
                        construirTablaDeSimbolos(i + 1, j + 1, "Palabra Reservada", token, "CONTRADICCION");
                        break;
                    case "deci":
                        construirTablaDeSimbolos(i + 1, j + 1, "Palabra Reservada", token, "DECIDIBLE");
                        break;
                    case "writestr":
                        construirTablaDeSimbolos(i + 1, j + 1, "Funcion", token, "FUNCION_WRITESTR");
                        break;
                    case "writelog":
                        construirTablaDeSimbolos(i + 1, j + 1, "Funcion", token, "FUNCION_WRITELOG");
                        break;
                    case "writeintro":
                        construirTablaDeSimbolos(i + 1, j + 1, "Funcion", token, "FUNCION_WRITEINTRO");
                        break;
                    case "writetable":
                        construirTablaDeSimbolos(i + 1, j + 1, "Funcion", token, "FUNCION_WRITETABLE");
                        break;
                    default:
                        if (!isNaN(parseFloat(token))) {
                            construirTablaDeSimbolos(i + 1, j + 1, "Número", token, "NUMERO");
                        } else {
                            construirTablaDeSimbolos(i + 1, j + 1, "Identificador", token, "IDENTIFICADOR");
                        }
                        break;
                }
            }
            numberOfLines++;
        }
    }

    function construirTablaDeSimbolos(_linea, _columna, _tipo, _token, _opCode) {
        tablaDeSimbolos.push({
            linea: _linea,
            columna: _columna,
            tipo: _tipo,
            token: _token,
            opCode: _opCode,
        });
    }

    const lineasCodigo = codigo.split("\n");
    tokenConstructor(lineasCodigo);

    return {
        tokens: tablaDeSimbolos,
        numberOfLines: numberOfLines
    };
}

// Hacer la función accesible desde fuera del archivo
window.analizadorLexico = analizadorLexico;
