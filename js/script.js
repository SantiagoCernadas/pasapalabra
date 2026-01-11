import * as lector from './lectorArchivo.js';

const botonJugar = document.getElementById("boton-jugar");

const contenedorPasapalabra = document.querySelector('.contenedor-pasapalabra');
const contenedorInicio = document.querySelector('.contenedor-inicio');
const inputRespuesta = document.getElementById('input-respuesta');
const letrasRosco = document.querySelectorAll('.letra');
const botonPasapalabra = document.getElementById('boton-pasapalabra');

const letrasAbecedario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

contenedorPasapalabra.style.display = 'none';

var partida = {
    roscoPartida: generarRosco(),
    letrasRestantes: 26,
    letraActual: 0,
    aciertos: 0,
    fallos: 0
}



botonJugar.addEventListener('click', () => {
    iniciarPartida();
    contenedorInicio.style.display = 'none';
    contenedorPasapalabra.style.display = 'flex';
})


inputRespuesta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (inputRespuesta.value !== '') {
            if (respuestaCorrecta(partida.roscoPartida[partida.letraActual].respuesta, inputRespuesta.value)) {
                partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = 'green'
                partida.aciertos++;
            }
            else {
                partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = 'red'
                partida.fallos++;
            }

            partida.roscoPartida[partida.letraActual].respondida = true;
            if (todasRespondidas()) {
                alert("Fin de la partida.")
                contenedorPasapalabra.style.display = 'none';
            }
            else {
                buscarLetraDisponible();
                inputRespuesta.value = '';
            }
        }
    }
})

botonPasapalabra.addEventListener('click', () => {
    partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = 'orange';
    inputRespuesta.value = '';
    buscarLetraDisponible();
})

function todasRespondidas(){
    var cantLetrasRespondidas = partida.aciertos + partida.fallos;
    return cantLetrasRespondidas == 26;
}

function siguienteLetra() {
    partida.letraActual += 1;
    if (partida.letraActual >= 26) {
        partida.letraActual = 0;
    }
}

function buscarLetraDisponible() {
    do {
        siguienteLetra();
    } while (partida.roscoPartida[partida.letraActual].respondida)
    definirPalabra(partida.letraActual);
}


async function iniciarPartida() {
    await generarRoscoJuego(partida.roscoPartida);
    partida.letrasRestantes = 26;
    partida.letraActual = 0;
    partida.aciertos = 0;
    partida.fallos = 0;
    definirPalabra(partida.letraActual);
}

function definirPalabra(letraActual) {
    partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = 'blue';
    document.getElementById("texto-letra-indice").textContent = partida.roscoPartida[letraActual].tipo + " " + partida.roscoPartida[letraActual].letra;
    document.getElementById("texto-definicion").textContent = partida.roscoPartida[letraActual].definicion;
    document.getElementById("letra-actual").textContent = partida.roscoPartida[letraActual].letra;
}

function generarRosco() {

    var rosco = [];
    letrasAbecedario.forEach((e, i) => {
        rosco.push({ letraHTML: letrasRosco[i], letra: e, tipo: '', definicion: '', respuesta: '', respondida: false });
    })
    return rosco;
}


async function generarRoscoJuego(rosco) {
    const archivo = await lector.leerArchivo();

    letrasAbecedario.forEach((e, i) => {
        const palabraAleatoria = Math.floor(Math.random() * archivo[i].length);
        const preguntaActual = archivo[i][palabraAleatoria];
        rosco[i].tipo = preguntaActual.tipo;
        rosco[i].definicion = preguntaActual.definicion;
        rosco[i].respuesta = preguntaActual.respuesta;
    })


    return rosco;
}

function respuestaCorrecta(palabra, respuesta) {
    const palabraMinuscula = palabra.toLowerCase();
    const respuestaMinuscula = respuesta.toLowerCase();

    const palabraLimpia = palabraMinuscula.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const respuestaLimpia = respuestaMinuscula.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return palabraLimpia === respuestaLimpia;
}