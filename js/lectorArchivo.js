const lector = new FileReader();

export async function leerArchivo(){
    try {
        // La ruta es relativa a la raíz del sitio
        const respuesta = await fetch('./public/archivoPasapalabra.json');
        
        if (!respuesta.ok) {
            throw new Error(`Error al cargar: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return datos;
        
        // Ejemplo: acceder a una propiedad
        // console.log(datos.nombre); 
    } catch (error) {
        console.error("Hubo un problema con la lectura:", error);
    }
}

