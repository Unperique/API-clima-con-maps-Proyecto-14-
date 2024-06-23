let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 },
        zoom: 8,
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log(place);
        if (!place.geometry) {
            console.error("No hay detalles : '" + place.name + "'");
            return;
        }

        // Centrar el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location);
        map.setZoom(10);

        // Colocar un marcador en la ubicación seleccionada
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });

        // Obtener y mostrar el clima actual en la ubicación seleccionada
        getWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

async function getWeather(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation`);
    const data = await response.json();

    // Actualizar el contenido de los elementos con la información del clima
    const temperatureElement = document.getElementById("temperature");
    const precipitationElement = document.getElementById("precipitation");
    const windElement = document.getElementById("wind");

    temperatureElement.textContent = `Temperatura: ${data.current_weather.temperature} °C`;
    windElement.textContent = `Viento: ${data.current_weather.windspeed} km/h`;

    // Seleccionar el primer valor de precipitación horario
    const precipitation = data.hourly.precipitation[0];
    precipitationElement.textContent = `Precipitación: ${precipitation} mm`;

    // Seleccionar y mostrar la imagen adecuada
    const weatherImageElement = document.getElementById("weather-image");
    const temperature = data.current_weather.temperature;

    let imageUrl = '';
    if (temperature <= 0) {
        imageUrl = 'images/snow.png';
    } else if (temperature > 0 && temperature <= 15) {
        imageUrl = 'images/cold.png';
    } else if (temperature > 15 && temperature <= 25) {
        imageUrl = 'images/mild.jpg';
    } else if (temperature > 25) {
        imageUrl = 'images/hot.png';
    }

    weatherImageElement.src = imageUrl;
    weatherImageElement.style.display = 'block';
}

window.onload = initMap;
