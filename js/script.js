const botonJugar = document.getElementById("boton-jugar");
const botonComoJugar = document.getElementById("boton-como-jugar");
document.querySelector('.contenedor-pasapalabra').style.display = 'none';

botonJugar.addEventListener('click',() => {
    document.querySelector('.contenedor-inicio').style.display = 'none';
    document.querySelector('.contenedor-pasapalabra').style.display = 'flex';
})

botonComoJugar.addEventListener('click',() => {
    alert("como jugar")
})