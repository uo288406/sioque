class City {

    constructor (countryName, coordinates){
        this.countryName = countryName;
        this.coordinates = coordinates;
    }

    callApi(){
        var coordinates = this.coordinates.split(',');
        var lat = coordinates[0].trim();
        var lon = coordinates[1].trim();

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
        
        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            success: function(data){
                var main = $("<main>").appendTo("body");

                var header = $("<h2>Tiempo en Noreña</h2>");
                main.append(header);

                // Clima actual
                var current = data.current_weather;
                var currentDiv = $("<article></article>");
                currentDiv.append(`<h3>Clima actual</h3>`);
                currentDiv.append(`<p>Temperatura: ${current.temperature} ºC</p>`);
                currentDiv.append(`<p>Viento: ${current.windspeed} km/h</p>`);
                main.append(currentDiv);

                var header = $("<h3>Para los próximos 7 días</h3>");
                main.append(header);

                // Previsión 7 días
                var days = data.daily.time;
                var maxTemps = data.daily.temperature_2m_max;
                var minTemps = data.daily.temperature_2m_min;
                var rain = data.daily.precipitation_sum;

                for (let i = 0; i < days.length; i++) {
                    var forecast = $("<article></article>");
                    forecast.append(`<h3>Fecha: ${days[i]}</h3>`);
                    forecast.append(`<p>Temperatura máxima: ${maxTemps[i]} ºC</p>`);
                    forecast.append(`<p>Temperatura mínima: ${minTemps[i]} ºC</p>`);
                    forecast.append(`<p>Precipitación: ${rain[i]} mm</p>`);
                    main.append(forecast);
                }
            },
            error: function(){
                console.log("Ha ocurrido un error obtiendo los datos");
            }
        })
    }
}