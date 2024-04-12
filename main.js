function listar_vuelos(data){
    
    var cardElement = document.createElement('div');
    cardElement.className = 'col-3';
    //cardElement.style.width = '18rem';
    cardElement.innerHTML = `
    <div class='card'>
        <div class='card-body'>
            <h5 class='card-title'>Vuelo: ${data.numero_vuelo}</h5>
              <h6 class='card-subtitle mb-2 text-muted'>${createDepartureInfo(data).outerHTML}</h6>
              <h6 class='card-subtitle mb-2 text-muted'>A las ${data.horaSalida}</h6>
            <p class='card-text'>Desde ${data.aeropuerto_salida}<br>
              <h6 class='card-subtitle mb-2 text-muted'>${createArrivalInfo(data).outerHTML}</h6>
              <h6 class='card-subtitle mb-2 text-muted'>A las ${data.horaLlegada}</h6>
            <p class='card-text'>a ${data.aeropuerto_llegada}<br>
            Escalas: ${data.num_escalas}<br>
            Precio: $${data.precio}<br>
            Aerolínea: ${data.aerolinea}<br>
            <button class="btn btn-primary">Seleccionar</button>
          </p>
        </div>
      </div>
    `;

    
    
    
    // Agrega la tarjeta al contenedor deseado en el DOM
    document.getElementById('resultados').appendChild(cardElement);
  }

    // Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtén el botón por su ID
    var searchButton = document.getElementById("searchButton");

    ///////
    var tipoVueloSelect = document.getElementById("tipoVuelo");
    var data;
    ///////
    var horaSalidaSelect = document.getElementById("horaSalida");
    ///////
    var horaLlegadaSelect = document.getElementById("horaLlegada");
    ///////
    var precioSelect = document.getElementById("precio");

    var passengers = parseInt(document.getElementById('passengers').value);

        // Validar si el número de pasajeros está dentro del rango permitido
        if (passengers < 1 || passengers > 30) {
            return;
        }

    // Agrega un listener para el evento 'click'
    searchButton.addEventListener("click", function() {
        // Coloca aquí el código que deseas ejecutar cuando se haga clic en el botón
        console.log("Se ha hecho clic en el botón de búsqueda.");

    ////
    var tipoVueloSeleccionado = tipoVueloSelect.value;
    var horaSalidaSeleccionada = horaSalidaSelect.value;
    var horaLlegadaSeleccionada = horaLlegadaSelect.value;
    var precioSeleccionado = precioSelect.value;
    ////

        aerolinea = document.getElementById("aerolinea").value;
        from = document.getElementById("from").value;
        to = document.getElementById("to").value;
        date = document.getElementById("dateRange").value;

        url ='https://my-json-server.typicode.com/MauWi4R/api.airlines/db/';
        if (aerolinea !== "all") { // Si no es la opción comodín, añade la aerolínea a la URL
          url += aerolinea;
        }

      axios.get(url, {
    params: {
      aeropuerto_salida: from,
      aeropuerto_llegada: to,
      fecha_salida: date
        }
      })
      .then(function (response) {
       //console.log(response.data);

      ///////
      if (response && response.data) {
                data = response.data;
                console.log("Datos de la respuesta de la solicitud AJAX:", data);
            } else {
                console.error("La respuesta de la solicitud AJAX no contiene datos válidos.");
            }
      //////

      if (precioSeleccionado === "mas") {
                data.sort(function(a, b) {
                    return b.precio - a.precio; // Ordenar de mayor a menor precio
                });
            } else if (precioSeleccionado === "menos") {
                data.sort(function(a, b) {
                    return a.precio - b.precio; // Ordenar de menor a mayor precio
                });
            }

      /////

       document.getElementById('resultados').innerHTML = "";
        
       //response.
        //data.forEach(function(item) {
          
          /////
          if (horaSalidaSeleccionada === "manana") {
    // Filtrar vuelos con hora de salida por la mañana
    data = data.filter(function(vuelo) {
      var horaSalida = parseInt(vuelo.horaSalida.split(":")[0]);
        return horaSalida < 12;
    });
} else if (horaSalidaSeleccionada === "tarde") {
    // Filtrar vuelos con hora de salida por la tarde
    data = data.filter(function(vuelo) {
      var horaSalida = parseInt(vuelo.horaSalida.split(":")[0]);
        return horaSalida >= 12
    });
}
/////

if (horaLlegadaSeleccionada === "mananas") {
                data = data.filter(function(vuelo) {
                    var horaLlegada = parseInt(vuelo.horaLlegada.split(":")[0]);
                    return horaLlegada < 12;
                });
            } else if (horaLlegadaSeleccionada === "tardes") {
                data = data.filter(function(vuelo) {
                    var horaLlegada = parseInt(vuelo.horaLlegada.split(":")[0]);
                    return horaLlegada >= 12 && horaLlegada < 20;
                });
            } else if (horaLlegadaSeleccionada === "noches") {
                data = data.filter(function(vuelo) {
                    var horaLlegada = parseInt(vuelo.horaLlegada.split(":")[0]);
                    return horaLlegada >= 20;
                });
            }

          ///////
          if (data) { // Comprueba si data está definida antes de utilizarla
                data.forEach(function(item) {
              
                    if ((tipoVueloSeleccionado === "directo" && item.num_escalas === 0) ||
                        (tipoVueloSeleccionado === "escala" && item.num_escalas !== 0) ||
                        (tipoVueloSeleccionado === "all")){
          //  console.log(item);
            listar_vuelos(item);
            }
            //////listar vuelos ya estaba
        });
      }
      
      if (data && data.length > 0) {
            data.forEach(function(item) {
                // Resto del código...
            });
            document.getElementById('opcionesDisponibles').style.display = 'block';
        } else {
            // No hay resultados disponibles, mostrar mensaje
            var noOptionsMessage = document.createElement('h2');
            noOptionsMessage.textContent = "Lo sentimos, no hay opciones disponibles :(";
            document.getElementById('resultados').appendChild(noOptionsMessage);
            document.getElementById('opcionesDisponibles').style.display = 'none';
        }

      })
      .catch(function (error) {
        console.log("Error en la solicitud AJAX:", error);
      })
      .finally(function () {
        // siempre sera ejecutado
      });  
      
     });
});

//FECHA
function createParagraph(text, className) {
    const paragraph = document.createElement('p');
    paragraph.className = className;
    paragraph.textContent = text;
    return paragraph;
}

function transformarFecha(fecha) {
    const partes = fecha.split("-");
    
    // Formato (dd-mm-yyyy)
    const fechaTransformada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    
    return fechaTransformada;
}

function createDepartureInfo(vuelo) {
    const fechaSalidaTransformada = transformarFecha(vuelo.fecha_salida);
    const info = `Salida: ${fechaSalidaTransformada}`;
    return createParagraph(info, 'card-text');
}

function createArrivalInfo(vuelo) {
    const fechaLlegadaTransformada = transformarFecha(vuelo.fecha_llegada);
    const info = `Destino: ${fechaLlegadaTransformada}`;
    return createParagraph(info, 'card-text');
}
