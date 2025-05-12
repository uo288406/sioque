import xml.etree.ElementTree as ET

def coordenadas(archivoXML):
   
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print ('Error procesando el archivo ', archivoXML)
        exit()
      
    raiz = arbol.getroot()

    ns = "{http://www.uniovi.es}"

    header_kml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n"                    
    header_kml += "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" + "\n"
    header_kml += "<Document>\n"

    footer_kml = "</Document>\n</kml>"

    nRuta = 1

    for ruta in raiz.findall('.//' + ns + 'ruta'):

        kml = ""
        kml += header_kml
        
        nombreRuta = ruta.get('nombreRuta')
        descripcion = ruta.find(ns + 'descripcion').text

        latitud = ruta.find(ns + 'coordenadasInicio/' + ns + 'latitud').text
        longitud = ruta.find(ns + 'coordenadasInicio/' + ns + 'longitud').text
        altitud = ruta.find(ns + 'coordenadasInicio/' + ns + 'altitud').text

        kml += crearMarcador(nombreRuta, descripcion, latitud, longitud, altitud)

        hitos = ruta.find('.//' + ns + 'hitos')
        for hito in hitos.findall('.//' + ns + 'hito'):

            nombreHito = hito.find(ns + 'nombreHito').text
            descripcion = hito.find(ns + 'descripcionHito').text
            latitud = hito.find(ns + 'coordenadasHito/' + ns + 'latitud').text
            longitud = hito.find(ns + 'coordenadasHito/' + ns + 'longitud').text
            altitud = hito.find(ns + 'coordenadasHito/' + ns + 'altitud').text

            kml += crearMarcador(nombreHito, descripcion, latitud, longitud, altitud)

        kml += footer_kml

        rutasKml = open("ruta" + str(nRuta) + ".kml", "w", encoding="utf-8")
        rutasKml.write(kml)
        rutasKml.close()
        nRuta += 1


def crearMarcador(nombre, descripcion, latitud, longitud, altitud):
    kml = ""
    kml += "\t<Placemark>\n"
    kml += "\t\t<name>" + nombre + "</name>\n"
    kml += "\t\t<description>" + descripcion + "</description>\n"
    kml += crearPunto(longitud, latitud, altitud)
    kml += "\t</Placemark>\n"
    return kml
    

def crearPunto(longitud, latitud, altitud):
    kml = ""
    kml += "\t\t<Point>\n"
    kml += f"\t\t\t<coordinates>{longitud},{latitud},{altitud}</coordinates>\n"
    kml += "\t\t</Point>\n"
    return kml

def main():
    archivoXML = "C:\\xampp\\htdocs\\Proyecto\\xml\\rutas.xml"
    coordenadas(archivoXML)   


if __name__ == "__main__":
    main()