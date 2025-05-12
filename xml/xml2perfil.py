import xml.etree.ElementTree as ET

def coordenadas_por_ruta(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
    except (IOError, ET.ParseError) as e:
        print(f"Error: {e}")
        exit()

    raiz = arbol.getroot()
    ns = "{http://www.uniovi.es}"

    header_svg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    header_svg += "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"2.0\">\n"
    footer_svg = "</svg>\n"

    num_ruta = 1

    for ruta in raiz.findall('.//' + ns + 'ruta'):
        num_punto = 20
        svg = header_svg
        text = ""

        nombreRuta = ruta.get('nombreRuta')
        coordRuta = ruta.find(ns + 'coordenadasInicio')
        despl_altura = 500
        altura_primero = despl_altura - int(coordRuta.find(ns + 'altitud').text)

        text += f"\t<text x=\"{num_punto}\" y=\"{altura_primero + 10}\" style=\"writing-mode: tb; glyph-orientation-vertical: 0;\">\n"
        text += f"\t\t{nombreRuta}\n\t</text>\n"

        hitos = ruta.find(ns + 'hitos')
        svg += "\t<polyline points=\""
        svg += f"{num_punto},{altura_primero} "

        for hito in hitos.findall(ns + 'hito'):
            distancia_str = hito.get('distancia', '0km').replace('km', '').strip()
            distancia = float(distancia_str) * 300  # metros

            num_punto += int(distancia / 10)

            altitud = int(hito.find('.//' + ns + 'altitud').text)
            altitud_dibujada = despl_altura - altitud
            svg += f"{num_punto},{altitud_dibujada} "

            nombreHito = hito.find(ns + 'nombreHito').text
            text += f"\t<text x=\"{num_punto}\" y=\"{altura_primero + 10}\" style=\"writing-mode: tb; glyph-orientation-vertical: 0;\">\n"
            text += f"\t\t{nombreHito}\n\t</text>\n"

            num_punto += 20

        svg += "\" style=\"fill:white;stroke:blue;stroke-width:1\"/>\n"
        svg += text + footer_svg

        with open(f"altimetria_ruta_{num_ruta}.svg", "w", encoding="utf-8") as archivo_salida:
            archivo_salida.write(svg)
        print(f"Archivo generado: altimetria_ruta_{num_ruta}.svg")
        num_ruta += 1

def main():
    archivoXML = "C:\\xampp\\htdocs\\Proyecto\\xml\\rutas.xml"
    coordenadas_por_ruta(archivoXML)

if __name__ == "__main__":
    main()
