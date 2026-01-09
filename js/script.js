const botonJugar = document.getElementById("boton-jugar");
const botonComoJugar = document.getElementById("boton-como-jugar");

const contenedorPasapalabra = document.querySelector('.contenedor-pasapalabra');
const contenedorInicio = document.querySelector('.contenedor-inicio');

const inputRespuesta = document.getElementById('input-respuesta');

contenedorPasapalabra.style.display = 'none';

var partida = {
    roscoPartida: [],
    letrasRestantes: 0,
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


function iniciarPartida(){
    partida.roscoPartida = generarRosco();
    console.log(partida.roscoPartida);
}


function generarRosco(){
    //26 letras
    //letra, indice, definicion, respondida
    var rosco = [];
    rosco.push({letra: 'A', indice: "Empieza con A", definición:"Arbol", respondida: false});
    rosco.push({letra: 'B', indice: "Empieza con B", definición:"Ballena", respondida: false});
    return rosco;
}