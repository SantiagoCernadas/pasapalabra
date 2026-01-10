import * as lector from './lectorArchivo.js';

const botonJugar = document.getElementById("boton-jugar");
const botonComoJugar = document.getElementById("boton-como-jugar");

const contenedorPasapalabra = document.querySelector('.contenedor-pasapalabra');
const contenedorInicio = document.querySelector('.contenedor-inicio');
const inputRespuesta = document.getElementById('input-respuesta');
const letrasRosco = document.querySelectorAll('.letra');

const letrasAbecedario = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];


contenedorPasapalabra.style.display = 'none';

var partida = {
    roscoPartida: generarRosco(),
    letrasRestantes: 26,
    aciertos: 0,
    fallos: 0 
}


botonJugar.addEventListener('click',() => {
    iniciarPartida();
    contenedorInicio.style.display = 'none';
    contenedorPasapalabra.style.display = 'flex';
})

botonComoJugar.addEventListener('click',() => {
    alert("como jugar")
})

inputRespuesta.addEventListener('keydown',function(e){
    if(e.key === 'Enter'){
        if(inputRespuesta.value !== ''){
            alert(inputRespuesta.value);
            inputRespuesta.value = '';
        }
    }
})


async function iniciarPartida(){
    var letraActual = 0;
    await generarRoscoJuego(partida.roscoPartida);
    console.log(partida.roscoPartida)
}


function generarRosco(){

    var rosco = [];
    letrasAbecedario.forEach( (e,i) => {
        rosco.push({letraHTML: letrasRosco[i],letra: e, tipo: '', definicion:'',respuesta:'', respondida: false});
    })
    return rosco;
}


async function generarRoscoJuego (rosco){
    const archivo = await lector.leerArchivo();

    letrasAbecedario.forEach( (e,i) => {
        const palabraAleatoria = Math.floor(Math.random() * archivo[i].length);
        const preguntaActual = archivo[i][palabraAleatoria];
        rosco[i].tipo = preguntaActual.tipo;
        rosco[i].definicion = preguntaActual.definicion;
        rosco[i].respuesta = preguntaActual.respuesta;
    })
    

    return rosco;
}