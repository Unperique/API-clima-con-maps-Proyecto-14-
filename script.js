let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 }, // Coordenadas de la ubicación inicial del mapa
        zoom: 8, // Nivel de zoom inicial del mapa
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map); // Enlazar los límites del campo de autocomplete con los límites del mapa

    autocomplete.addListener("place_changed", () => { // Evento que se dispara cuando se selecciona una ubicación en el campo de autocomplete
        const place = autocomplete.getPlace(); // Obtiene la ubicación seleccionada
        console.log(place); // Imprime la ubicación seleccionada en la consola
        if (!place.geometry) { // Si la ubicación seleccionada no tiene detalles
            console.error("No hay detalles : '" + place.name + "'"); // Imprime un mensaje de error
            return;
        }

        // Centrar el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location); // Establece el centro del mapa en la ubicación seleccionada
        map.setZoom(10); // Establece el nivel de zoom del mapa a 10

        // Colocar un marcador en la ubicación seleccionada
        if (marker) {
            marker.setMap(null); // Si ya hay un marcador en el mapa, lo elimina
        }
        marker = new google.maps.Marker({ // Crea un nuevo marcador en la ubicación seleccionada
            map: map, // Establece el mapa al que pertenece el marcador
            position: place.geometry.location, // Establece la posición del marcador en la ubicación seleccionada
        });

        // Obtener y mostrar el clima actual en la ubicación seleccionada
        getWeather(place.geometry.location.lat(), place.geometry.location.lng()); // Llama a la función getWeather con las coordenadas de la ubicación seleccionada
    });
}

/**
 * Función asíncrona que obtiene la información del clima actual a partir de las coordenadas
 * de latitud y longitud proporcionadas.
 *
 * @param {number} lat - Coordenada de latitud de la ubicación.
 * @param {number} lon - Coordenada de longitud de la ubicación.
 */
async function getWeather(lat, lon) {
    // Realiza una solicitud HTTP GET para obtener los datos del clima actual.
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation`);

    // Convierte la respuesta en formato JSON.
    const data = await response.json();

    // Actualiza el contenido de los elementos con la información del clima.
    const temperatureElement = document.getElementById("temperature"); // Obtiene el elemento con el id "temperature".
    const precipitationElement = document.getElementById("precipitation"); // Obtiene el elemento con el id "precipitation".
    const windElement = document.getElementById("wind"); // Obtiene el elemento con el id "wind".

    temperatureElement.textContent = `Temperatura: ${data.current_weather.temperature} °C`; // Actualiza el contenido del elemento con la temperatura.
    windElement.textContent = `Viento: ${data.current_weather.windspeed} km/h`; // Actualiza el contenido del elemento con la velocidad del viento.

    // Selecciona el primer valor de precipitación horaria.
    const precipitation = data.hourly.precipitation[0];
    precipitationElement.textContent = `Precipitación: ${precipitation} mm`; // Actualiza el contenido del elemento con la precipitación.

    // Selecciona y muestra la imagen adecuada.
    const weatherImageElement = document.getElementById("weather-image"); // Obtiene el elemento con el id "weather-image".
    const temperature = data.current_weather.temperature; // Obtiene la temperatura actual.

    let imageUrl = ''; // Inicializa una variable para almacenar la URL de la imagen.

    if (temperature <= 0) {
        imageUrl = 'images/snow.png'; // Asigna la URL de la imagen de nieve si la temperatura es menor o igual a cero.
    } else if (temperature > 0 && temperature <= 15) {
        imageUrl = 'images/cold.png'; // Asigna la URL de la imagen de frío si la temperatura está entre 1 y 15 grados Celsius.
    } else if (temperature > 15 && temperature <= 25) {
        imageUrl = 'images/mild.jpg'; // Asigna la URL de la imagen de temperatura moderada si la temperatura está entre 16 y 25 grados Celsius.
    } else if (temperature > 25) {
        imageUrl = 'images/hot.png'; // Asigna la URL de la imagen de calor si la temperatura es mayor a 25 grados Celsius.
    }

    weatherImageElement.src = imageUrl; // Establece la URL de la imagen en el elemento "weather-image".
    weatherImageElement.style.display = 'block'; // Muestra la imagen.
}

// Ejecuta la función "initMap" cuando se carga la página.
window.onload = initMap;
