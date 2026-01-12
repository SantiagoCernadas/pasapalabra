import * as lector from './lectorArchivo.js';

const botonJugar = document.getElementById("boton-jugar");

const contenedorPasapalabra = document.querySelector('.contenedor-pasapalabra');
const contenedorInicio = document.querySelector('.contenedor-inicio');
const contenedorFinPartida = document.querySelector('.contendor-fin-juego');

const inputRespuesta = document.getElementById('input-respuesta');
const letrasRosco = document.querySelectorAll('.letra');
const botonPasapalabra = document.getElementById('boton-pasapalabra');
const botonVolverAJugar = document.getElementById('volver-jugar');

const cronometro = document.getElementById('cronometro');

const letrasAbecedario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var temporizador;

var partida = {
    roscoPartida: [],
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


botonVolverAJugar.addEventListener('click', () => {
    iniciarPartida();
    contenedorFinPartida.style.display = 'none';
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
                finPartida("Se completo el rosco");
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

function finPartida(mensaje){
    clearInterval(temporizador);
    document.getElementById('razon-fin').textContent = mensaje;
    document.getElementById('texto-aciertos').textContent = partida.aciertos;
    document.getElementById('texto-fallos').textContent = partida.fallos;
    contenedorPasapalabra.style.display = 'none';
    contenedorFinPartida.style.display = 'flex';
}


async function iniciarPartida() {

    temporizador = iniciarTemporizador();

    partida.roscoPartida = generarRosco();
    await generarRoscoJuego(partida.roscoPartida);
    partida.letrasRestantes = 26;
    partida.letraActual = 0;
    partida.aciertos = 0;
    partida.fallos = 0;
    inputRespuesta.value = '';
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
        letrasRosco[i].style.backgroundColor  = '#0072A3'
    })
    return rosco;
}

function iniciarTemporizador(){
    var tiempoRestanteRosco = 100;
    cronometro.style.backgroundColor = '#82E0AA';
    cronometro.textContent = tiempoRestanteRosco;
    return setInterval(()=>{
        tiempoRestanteRosco--;
        cronometro.textContent = tiempoRestanteRosco;
        if(tiempoRestanteRosco < 0){
            finPartida("Se acabo el tiempo");
        }
        else if(tiempoRestanteRosco < 10){
           cronometro.style.backgroundColor = '#C11007'; 
        }
        else if(tiempoRestanteRosco < 25){
           cronometro.style.backgroundColor = '#E1712B'; 
        }
        else if(tiempoRestanteRosco < 50){
           cronometro.style.backgroundColor = '#FFDF20'; 
        }
        else if(tiempoRestanteRosco < 75){
           cronometro.style.backgroundColor = '#9AE630'; 
        }
        
    },1000);
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