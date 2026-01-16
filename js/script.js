import * as lector from './lectorArchivo.js';

const botonJugar = document.getElementById("boton-jugar");
const botonConfiguracion = document.getElementById("boton-configuracion");

const contenedorInicio = document.getElementById('contenedor-inicio');
const contenedorConfiguracion = document.getElementById('contenedor-configuracion');
const contenedorPasapalabra = document.getElementById('contenedor-pasapalabra');
const contenedorFinPartida = document.getElementById('contendor-fin-juego');

const botonAceptarConfiguracion = document.getElementById('boton-aceptar-configuracion');

const inputRespuesta = document.getElementById('input-respuesta');
const letrasRosco = document.querySelectorAll('.letra');

const botonPasapalabra = document.getElementById('boton-pasapalabra');

const botonVolverAJugar = document.getElementById('volver-jugar');
const botonVolverInicioJuego = document.getElementById('volver-inicio-juego');

const cronometro = document.getElementById('cronometro');


if(localStorage.getItem('tiempoPartida') === null){
    localStorage.setItem('tiempoPartida',100);
}

const configTiempoPartida = document.getElementById('tiempo-partida');

configTiempoPartida.value = localStorage.getItem('tiempoPartida');
var tiempoPartida = configTiempoPartida.value;

configTiempoPartida.addEventListener('change', function() {
    localStorage.setItem('tiempoPartida',configTiempoPartida.value);
    tiempoPartida = configTiempoPartida.value;
});


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
    contenedorInicio.style.display = 'none';
    iniciarPartida();
})

botonConfiguracion.addEventListener('click', () => {
    contenedorInicio.style.display = 'none';
    contenedorConfiguracion.style.display = 'flex';
})

botonAceptarConfiguracion.addEventListener('click', () => {
    contenedorConfiguracion.style.display = 'none';
    contenedorInicio.style.display = 'flex';
})


botonVolverAJugar.addEventListener('click', () => {
    iniciarPartida();
    contenedorFinPartida.style.display = 'none';
})

botonVolverInicioJuego.addEventListener('click', () => {
    contenedorFinPartida.style.display = 'none';
    contenedorInicio.style.display = 'flex';
})


inputRespuesta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (inputRespuesta.value !== '') {
            if (respuestaCorrecta(partida.roscoPartida[partida.letraActual].respuesta, inputRespuesta.value)) {
                partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = '#48976a'
                partida.roscoPartida[partida.letraActual].respondidaCorrectamente = true;
                partida.aciertos++;
            }
            else {
                partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = '#7a2e32'
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
    partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = '#d0a001';
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
    generarEstadistica();
    contenedorPasapalabra.style.display = 'none';
    contenedorFinPartida.style.display = 'flex';
}

function generarEstadistica(){
    const contenedorRespuestas = document.querySelector('.contenedor-respuestas');
    contenedorRespuestas.innerHTML = '';
    partida.roscoPartida.forEach((e, i) => {
        const contenedorLetraRespuesta = document.createElement('div');
        contenedorLetraRespuesta.classList.add('contenedor-letra-respuesta');
        const letra = document.createElement('p');
        letra.classList.add('respuesta-letra');
        letra.textContent = e.letra;

        const definicion = document.createElement('p');

        definicion.classList.add('respuesta-definicion');
        definicion.textContent = e.definicion

        const respuesta = document.createElement('p');
        respuesta.classList.add('respuesta-palabra');
        respuesta.textContent = e.respuesta;

        contenedorLetraRespuesta.appendChild(letra);
        contenedorLetraRespuesta.appendChild(definicion);
        contenedorLetraRespuesta.appendChild(respuesta);

        if(!e.respondida){
            contenedorLetraRespuesta.style.backgroundColor = '#FFDF20'
        }
        else{
            if(e.respondidaCorrectamente){
                contenedorLetraRespuesta.style.backgroundColor = '#82E0AA'
            }
            else{
                contenedorLetraRespuesta.style.backgroundColor = '#FC5F67'
            }
        }

        contenedorRespuestas.appendChild(contenedorLetraRespuesta);
    })
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
    contenedorPasapalabra.style.display = 'flex';
}

function definirPalabra(letraActual) {
    partida.roscoPartida[partida.letraActual].letraHTML.style.backgroundColor = '#002F75';
    document.getElementById("texto-letra-indice").textContent = partida.roscoPartida[letraActual].tipo + " " + partida.roscoPartida[letraActual].letra;
    document.getElementById("texto-definicion").textContent = partida.roscoPartida[letraActual].definicion;
    document.getElementById("letra-actual").textContent = partida.roscoPartida[letraActual].letra;
}

function generarRosco() {
    var rosco = [];
    letrasAbecedario.forEach((e, i) => {
        rosco.push({ letraHTML: letrasRosco[i], letra: e, tipo: '', definicion: '', respuesta: '', respondida: false,respondidaCorrectamente:false });
        letrasRosco[i].style.backgroundColor  = '#0072A3'
    })
    return rosco;
}

function iniciarTemporizador(){
    var tiempoRestanteRosco = tiempoPartida;
    cronometro.style.backgroundColor = '#82E0AA';
    cronometro.textContent = tiempoRestanteRosco;
    return setInterval(()=>{
        tiempoRestanteRosco--;
        cronometro.textContent = tiempoRestanteRosco;
        if(tiempoRestanteRosco < 0){
            finPartida("Se acabo el tiempo");
        }
        else if(tiempoRestanteRosco / tiempoPartida < 0.1){
           cronometro.style.backgroundColor = '#C11007'; 
        }
        else if(tiempoRestanteRosco / tiempoPartida < 0.25){
           cronometro.style.backgroundColor = '#E1712B'; 
        }
        else if(tiempoRestanteRosco / tiempoPartida < 0.5){
           cronometro.style.backgroundColor = '#FFDF20'; 
        }
        else if(tiempoRestanteRosco / tiempoPartida < 0.75){
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
}

function respuestaCorrecta(palabra, respuesta) {
    const palabraMinuscula = palabra.toLowerCase();
    const respuestaMinuscula = respuesta.toLowerCase();

    const palabraLimpia = palabraMinuscula.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const respuestaLimpia = respuestaMinuscula.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return palabraLimpia === respuestaLimpia;
}