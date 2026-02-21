// Variables globales
let NumAnterior = '';  // Primer número
let operador = null;   // Operador seleccionado (+, -, x, /, %)
let numeroActual = ''; // Segundo número (o el que se está escribiendo)
let resultado = null;
let operacionCompleta = false; // Variable para controlar cuando termina una operación

function recogerBotones(callback) {
    const botones = document.querySelectorAll('.contenedor button');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const valor = boton.value;
            callback(valor);
        });
    });
}

function inicializarCalculadora() {

    const pantalla = document.getElementById('operaciones');

    recogerBotones((valor) => {

            // Primero comprobamos si el botón es de limpieza
            if (limpiarPantalla(valor, pantalla)) {
                return; // Si se limpió, no hacer nada más
            }

            // Si acabamos de completar una operación y presionamos un numero, empezar de nuevo
            if (operacionCompleta && (!isNaN(valor) || valor === '.')) {
                numeroActual = '';
                operacionCompleta = false;
            }


            // Si es un número o punto
            if (!isNaN(valor) || valor === '.') {
                // Evitar multiples puntos decimales
                if (valor === '.' && numeroActual.includes('.')) {
                    return;
                }
                numeroActual += valor;
                pantalla.value = numeroActual;
            }
            // Si es un operador basico
            else if (['+', '-', '*', '/', '%'].includes(valor)) {
                if (numeroActual === '' && NumAnterior === '') {
                    return; // No hacer nada si no hay número
                }

                // Si ya hay una operación pendiente, calcularla primero
                if (operador && NumAnterior !== '' && numeroActual !== '') {
                    const res = operar(parseFloat(NumAnterior), parseFloat(numeroActual), operador);
                    pantalla.value = res;
                    NumAnterior = res.toString();
                    numeroActual = '';
                } else if (numeroActual !== '') {
                    NumAnterior = numeroActual;
                    numeroActual = '';
                }

                operador = valor;
                operacionCompleta = false;
            }
            // Raíz cuadrada
            else if (valor === '√') {
                if (numeroActual !== '') {
                    resultado = operar(parseFloat(numeroActual), null, '√');
                    if (resultado !== undefined && resultado !== 'Error') {
                        pantalla.value = resultado;
                        numeroActual = resultado.toString();
                        NumAnterior = '';
                        operador = null;
                        operacionCompleta = true;
                    } else {
                        pantalla.value = 'Error';
                    }
                }
            }
            // Igual
            else if (valor === '=') {
                if (operador && NumAnterior !== '' && numeroActual !== '') {
                    resultado = operar(parseFloat(NumAnterior), parseFloat(numeroActual), operador);
                    if (resultado !== 'Error') {
                        pantalla.value = resultado;
                        numeroActual = resultado.toString();
                        NumAnterior = '';
                        operador = null;
                        operacionCompleta = true;
                    } else {
                        pantalla.value = 'Error';
                    }
                }
                else {
                    pantalla.value = 'Error';
                    return;
                }
            }
    });
}

function limpiarPantalla(valor, pantalla) {
    if (valor === 'AC') {
        pantalla.value = ''; // Borra todo
        // Reiniciar las variables
        NumAnterior = '';
        operador = null;
        numeroActual = '';
        resultado = null;
        operacionCompleta = false;
        return true;
    } else if (valor === 'C') {
        if (numeroActual !== '') {
            numeroActual = numeroActual.slice(0, -1);
            pantalla.value = numeroActual || '0';
        } else {
            pantalla.value = '0';
        }
        return true;
    }
    return false;
}

function operar(num1, num2, signo) {
    if (signo === '√') {
        if (num1 < 0) {
            return 'Error'; // No se puede calcular raíz de número negativo
        }
        return Math.sqrt(num1);
    } else if (num1 !== '' && num2 !== '' && signo !== '') {
        switch (signo) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                return num2 !== 0 ? num1 / num2 : 'Error';
            case '%':
                return (num1 * num2) / 100;
            default:
                return 'Error';
        }
    }

    return 'Error';
}

window.addEventListener('DOMContentLoaded', inicializarCalculadora);