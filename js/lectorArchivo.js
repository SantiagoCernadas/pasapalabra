export async function leerArchivo(){
    try {
        const respuesta = await fetch('./public/archivoPasapalabra.json');
        
        if (!respuesta.ok) {
            throw new Error(`Error al cargar: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return datos;
        
    } catch (error) {
        console.error("Hubo un problema con la lectura:", error);
    }
}