class Rutas {
    constructor(){
        this.processXML();
    }

    processXML(){    
        var main = $("<main></main>");
        $("body").append(main);
        var section = $("<section></section>");
        section.append("<h3>Procesado de XML</h3>");
        var label = $("<p><label for='xmlFile'>Cargar archivos xml</label></p>");
        section.append(label);

        var input = $("<p><input type='file' id='xmlFile' accept='.xml'></p>");
        input.on('change', this.createXML.bind(section));
        section.append(input);

        $("main").append(section);
    }

    createXML(event){
        var xmlFile = event.target.files[0];
    
        var textType = /text.xml/
        if (xmlFile.type.match(textType)) {
            var reader = new FileReader();
            var thisBefore = this;

            reader.onload = function (event) {
                var xmlRoutes = $.parseXML(reader.result); 

                $(xmlRoutes).find('ruta').each(function(index){
                    const nombreRuta = $(this).attr('nombreRuta');
                    const fechaInicio = $(this).attr('fechaInicio');
                    const horaInicio = $(this).attr('horaInicio');
                    const tipo = $(this).find('tipo').text();
                    const medioTransporte = $(this).find('medioTransporte').text();
                    const duracion = $(this).find('duracion').text();
                    const agencia = $(this).find('agencia').text();
                    const personasAdecuadas =  $(this).find('personasAdecuadas').text();
                    const descripcion = $(this).find('descripcion').text();
                    const lugarInicio = $(this).find('lugarInicio').text();
                    const direccionInicio = $(this).find('direccionInicio').text();
                    const longitud = $(this).find('coordenadasInicio > longitud').text();
                    const latitud = $(this).find('coordenadasInicio > latitud').text();
                    const altitud = $(this).find('coordenadasInicio > altitud').text();

                    const referencias = [];
                    $(this).find('referencias > referencia').each(function() {
                        referencias.push($(this).text());
                    });

                    const recomendacion = $(this).find('recomendacion').text();

                    const article = $('<article></article>');
                    const title = $('<h4></h4>').text(`${nombreRuta} - ${fechaInicio} ${horaInicio}`);
                    const typeElement = $('<p></p>').text(`Tipo: ${tipo}`);
                    const tranElement = $('<p></p>').text(`Transporte: ${medioTransporte}`);
                    const durationElement = $('<p></p>').text(`Duración: ${duracion}`);
                    const managerElement =  $('<p></p>').text(`Agencia: ${agencia}`);
                    const peopleElement =  $('<p></p>').text(`Personas adecuadas: ${personasAdecuadas}`);
                    const descElement = $('<p></p>').text(`Descripción: ${descripcion}`);
                    const lugarInElement = $('<p></p>').text(`Lugar de unicio: ${lugarInicio}`);
                    const direccionInElement = $('<p></p>').text(`Direccción de inicio: ${direccionInicio}`);
                    const coordenadasElement = $('<p></p>').text(`Coordenadas: ${latitud}, ${longitud} - ${altitud} m`);

                    const referenciasTitle = $('<p></p>').text('Referencias:');
                    const referenciasList = $('<ul></ul>');

                    referencias.forEach(function(ref){
                        const item = $('<li></li>').append(
                            $('<a></a>').attr('href', ref).text(ref)
                        );
                        referenciasList.append(item);
                    });

                    const recomendacionElement = $('<p></p>').text(`Puntuación de la ruta: ${recomendacion}`);

                    article.append(title, typeElement, tranElement, durationElement, managerElement);
                    article.append(peopleElement, descElement, lugarInElement, direccionInElement, coordenadasElement, 
                                   referenciasTitle, referenciasList, recomendacionElement);
                    
                    const hitos = $(this).find('hito');
                    article.append($("<p>Hitos:</p>"));

                    hitos.each(function(){ 
                        const nombreHito = $(this).find('nombreHito').text();
                        const descHito = $(this).find('descHito').text();

                        const longitud = $(this).find('coordenadasHito > longitud').text();
                        const latitud = $(this).find('coordenadasHito > latitud').text();
                        const altitud = $(this).find('coordenadasHito > altitud').text();

                        const nombreHitoElement = $('<h5></h5>').text(nombreHito);
                        const descHitoElement = $('<p></p>').text(`${descHito}`);
                        const coordenadasHitoElement = $('<p></p>').text(`Coordenadas: ${latitud}, ${longitud} - ${altitud} m`);
                        
                        const hitoPhoto = $(this).find('galeriaFotosHito > foto').text();          
                        const imgHito = $('<img/>');
                        imgHito.attr("src", "multimedia/imagenes/" + hitoPhoto);
                        imgHito.attr("alt", descHito);

                        article.append(nombreHitoElement);
                        article.append(descHitoElement);
                        article.append(coordenadasHitoElement);
                        article.append(imgHito);
                    });

                    thisBefore.append(article);

                    const ficheroKML = "xml/" + $(this).find('planimetria').text();
                    const mapId = `kmlMap-${index}`;

                    const kmlSection = $("<section></section>");
                    kmlSection.append($("<h3>Mapa con los datos del KML</h3>"));
                    kmlSection.attr("id", mapId);
                    article.append(kmlSection);

                    L.mapbox.accessToken = 'pk.eyJ1IjoidW8yODg0MDYiLCJhIjoiY200MDZjamNuMjU2MDJycXpsOGFtMmQ4ayJ9.pLQtA7PIIhpqgQuNGCzcMA';

                    var map = L.mapbox.map(mapId)
                                      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v12'))
                                      .setView([43.3938, -5.7078], 8);
                    
                    omnivore.kml(ficheroKML)
                    .on('ready', function () {
                        this.addTo(map);
                        map.fitBounds(this.getBounds());

                        var points = this.getLayers().map(function (layer) {
                            return layer.getLatLng(); 
                        });
                
                        var polyline = L.polyline(points, { color: 'red' });
                        polyline.addTo(map); 
                    })
                    .on('error', function(e) {
                        console.error("Error al cargar KML:", e.error);
                        kmlSection.append("<p>No se pudo cargar el archivo KML.</p>");
                    });
                    
                    const ficheroSVG = $(this).find('altimetria').text();

                    const svgSection = $("<section></section>");
                    svgSection.append("<h3>Gráfico de altimetría</h3>");
                    article.append(svgSection);

                    fetch("xml/" + ficheroSVG)
                        .then(response => {
                            if (!response.ok) throw new Error("No se pudo cargar el SVG");
                            return response.text();
                        })
                        .then(svgContent => {
                            const svg = $($.parseXML(svgContent)).find("svg");
                            svg.attr("version", "1.1");
                            svgSection.append(svg);
                        })
                        .catch(err => {
                            console.error("Error al cargar el SVG:", err);
                            svgSection.append("<p>No se pudo cargar el gráfico SVG.</p>");
                        });
                });
            }
            reader.readAsText(xmlFile);
        }
        else {
            alert("Error: Archivo no válido");
        }       
    }

}
