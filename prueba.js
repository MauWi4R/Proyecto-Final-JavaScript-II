const baseURL = "http://localhost:3000/";

document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe

    // Obtener los valores del formulario
    const formData = new FormData(event.target);
    const from = formData.get('from').toUpperCase().trim();
    const to = formData.get('to').toUpperCase().trim();
    const date = formData.get('dateRange');

    console.log('from:', from);
    console.log('to:', to);
    console.log('date:', date);
    
    // Realizar la solicitud GET a la API con los parámetros de consulta
    try {
        
        const baseURL = "http://localhost:3000/";
        const response = await axios.get(baseURL, {
            params: {
                aeropuerto_salida: from,
                aeropuerto_llegada: to,
                fechaSalida: date
            }
        });

        console.log('response:', response);

        // Limpiar el contenedor antes de mostrar los vuelos filtrados
        const container = document.getElementById('vuelosRelacionados');
        container.innerHTML = '';

        // Mostrar las cards de vuelo que coinciden con los criterios de búsqueda
        const vuelos = response.data;
        console.log('vuelos:', vuelos);
        
        if (vuelos.length === 0) {
            container.textContent = 'No se encontraron vuelos que coincidan con los criterios de búsqueda.';
        } else {
            vuelos.forEach(vuelo => {
                const card = createFlightCard(vuelo);
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Hubo un error al obtener los vuelos:', error);
    }
});




function createFlightCard(vuelo) {
    const card = document.createElement('div');
    card.className = 'card w-50';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const numVuelo = createParagraph(`Vuelo: ${vuelo.numero_vuelo}`, 'card-title');
    const aerolinea = createParagraph(`Aerolínea: ${vuelo.aerolinea}`, 'card-text');
    const salida = createDepartureInfo(vuelo);
    const llegada = createArrivalInfo(vuelo);
    const escalas = createParagraph(`Escalas: ${vuelo.num_escalas}`, 'card-text');
    const precio = createParagraph(`Precio: $${vuelo.precio.toFixed(2)}`, 'card-text');

    const botonSeleccionar = document.createElement('a');
    botonSeleccionar.href = '#';
    botonSeleccionar.className = 'btn btn-primary';
    botonSeleccionar.textContent = 'Seleccionar';

    cardBody.appendChild(numVuelo);
    cardBody.appendChild(aerolinea);
    cardBody.appendChild(salida);
    cardBody.appendChild(llegada);
    cardBody.appendChild(escalas);
    cardBody.appendChild(precio);
    cardBody.appendChild(botonSeleccionar);

    card.appendChild(cardBody);
    return card;
}

function createParagraph(text, className) {
    const paragraph = document.createElement('p');
    paragraph.className = className;
    paragraph.textContent = text;
    return paragraph;
}

function createDepartureInfo(vuelo) {
    const [fechaSalida, horaSalida] = vuelo.fecha_salida.split("T");
    const info = `Salida: ${fechaSalida} a las ${horaSalida} desde ${vuelo.aeropuerto_salida}`;
    return createParagraph(info, 'card-text');
}


function createArrivalInfo(vuelo) {
    const [fechaLlegada, horaLlegada] = vuelo.fecha_llegada.split("T");
    const info = `Destino: ${fechaLlegada} a las ${horaLlegada} a ${vuelo.aeropuerto_llegada}`;
    return createParagraph(info, 'card-text');
}