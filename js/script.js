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
    letrasRosco[0].style.backgroundColor = 'yellow';
    letrasRosco[0].style.color = 'black';
    console.log(partida);
}


function generarRosco(){

    var rosco = [];
    letrasAbecedario.forEach( (e,i) => {
        rosco.push({letraHTML: letrasRosco[i],letra: e,palabra: '', indice: '', definición:'', respondida: false});
    })
    return rosco;
}