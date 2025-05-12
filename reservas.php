<!DOCTYPE HTML>
<html lang="es">
	<head>
	<!-- Datos que describen el documento -->
	<meta charset="UTF-8" />
	<title>Proyecto</title>
	 
    <meta name="author" content ="Claudia Rodriguez Fuertes" />
    <meta name="description" content ="documento inicial de recursos turisticos" />
    <meta name="keywords" content ="" />
    <meta name="viewport" content ="width=device-width, initial-scale=1.0" />
     
	<link rel="icon" href="multimedia/imagenes/favicon.ico" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
	</head>
	<body>
		<header>
			<h1> <a href="index.html"> Proyecto </a> </h1>

			<nav>
				<a href="index.html" accesskey="i" tabindex="1" title="Inicio">Inicio</a>
				<a href="gastronomia.html" accesskey="g" tabindex="2" title="Gastronomía">Gastronomía</a>
				<a href="rutas.html" accesskey="r" tabindex="3" title="Rutas">Rutas</a>
				<a href="meteorologia.html" accesskey="m" tabindex="5" title="Meteorología">Meteorología</a>
				<a href="juego.html" accesskey="j" tabindex="6" title="Juego">Juego</a>
				<a href="reservas.php" accesskey="t" tabindex="7" class="active" title="Reservas">Reservas</a>
				<a href="ayuda.html" accesskey="a" tabindex="8" title="Ayuda">Ayuda</a>
			</nav>
	 	 
		</header>

		<?php
			session_start();
			class Reservas {
				
				private $server;
				private $user;
				private $pass;
				private $dbname;

				public function __construct(){
					$this->server = "localhost";
					$this->user = "DBUSER2025";
					$this->pass = "DBPWD2025";
					$this->dbname = "reservas";				
				}

				private function getConnection(){
					$conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
					if ($conn->connect_error) {
						die("<p>Conexión fallida: ".$conn->connect_error."</p>");
					}

					return $conn;
				}


				public function formularioRegistro() {
					echo '<h2>Registro de Usuario</h2>';
					echo '<form method="post">';
					echo '<label>Nombre: <input type="text" name="nombre" required></label>';
					echo '<label>Email: <input type="email" name="email" required></label>';
					echo '<label>Contraseña: <input type="password" name="password" required></label>';
					echo '<input type="submit" name="registrar" value="Registrarse">';
					echo '</form>';
				}

				public function registrarUsuario($nombre, $email, $password){
					$conn = $this->getConnection();
					$hash = password_hash($password, PASSWORD_DEFAULT);
					$stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
					$stmt->bind_param("sss", $nombre, $email, $hash);
					$res = $stmt->execute();
					$usuario_id = $conn->insert_id;
					$conn->close();

					if ($res) {
						$_SESSION["usuario_id"] = $usuario_id;
						echo "<p>Usuario registrado correctamente.</p>";
					} else {
						echo "<p>Error al registrar.</p>";
					}

					return $res;
				}
			
				public function obtenerRecursos(){
					$conn = $this->getConnection();
					$sql = "SELECT r.*, t.nombre AS tipo FROM recursos_turisticos r JOIN tipos_recurso t ON r.tipo_id = t.id";
					$res = $conn->query($sql);
					$recursos = [];
					while($row = $res->fetch_assoc()){
						$recursos[] = $row;
					}
					$conn->close();
					return $recursos;
				}
				

				public function mostrarRecursos() {
					$recursos = $this->obtenerRecursos(); 
				
					echo "<h2>Recursos Turísticos Disponibles</h2>";
					echo "<form method='post'>";
					echo "<ul>"; 
				
					foreach ($recursos as $recurso) {
						echo "<li>";
						echo "<input type='checkbox' name='recurso_id[]' value='" . $recurso['id'] . "'>";
						echo $recurso['descripcion'] .".";
				
						echo " Tipo: ". $recurso['tipo'] .".";

						$inicio = new DateTime($recurso['fecha_inicio'] . ' ' . $recurso['hora_inicio']);
						$fin = new DateTime($recurso['fecha_fin'] . ' ' . $recurso['hora_fin']);
						$duracion = $inicio->diff($fin);
				
						echo " Fecha y Hora de Inicio: " . $recurso['fecha_inicio'] . " " . $recurso['hora_inicio'] .".";
						echo " Fecha y Hora de Finalización: " . $recurso['fecha_fin'] . " " . $recurso['hora_fin'] .".";
				
						echo " Duración: " . $duracion->format('%h horas %i minutos') . ".";

						echo " Número de plazas: " . $recurso['limite_ocupacion'] .".";
		
						echo " Precio: " . $recurso['precio'] .".";
				
						echo "</li>";
					}
				
					echo "</ul>"; 
					echo "<input type='submit' name='reservar' value='Reservar'>";
					echo "</form>";
				}				

				public function hacerReserva($usuario_id, $recurso_id){
					$conn = $this->getConnection();
					$stmt = $conn->prepare("INSERT INTO reservas (usuario_id, recurso_id) VALUES (?, ?)");
					$stmt->bind_param("ii", $usuario_id, $recurso_id);
					$stmt->execute();
					$reserva_id = $conn->insert_id;
			
					$sql = "SELECT precio FROM recursos_turisticos WHERE id = $recurso_id";
					$res = $conn->query($sql);
					$precio = $res->fetch_assoc()['precio'];
			
					$conn->close();

					return [
						'reserva_id' => $reserva_id,
						'precio' => $precio
					];
				}

				public function mostrarReservasUsuario($usuario_id){				
					$reservas = $this->obtenerReservasUsuario($usuario_id);
				
					if (count($reservas) > 0) {
						echo "<h2>Mis Reservas</h2>";
				
						foreach ($reservas as $reserva) {
							echo "<h3>Recurso: " . $reserva['descripcion'] . "</h3>";
							echo "<p>Precio: " . $reserva['precio'] . "€</p>";
							echo "<p>Fecha de Reserva: " . $reserva['fecha_reserva'] . "</p>";

							echo 	"<form method='post'>
									<input type='hidden' name='reserva_id' value='" . $reserva['id'] . "'>
									<input type='submit' name='anular' value='Anular Reserva'>
									</form>";
						}
					} else {
						echo "<p>No tienes reservas.</p>";
					}
				}
				
			
				public function obtenerReservasUsuario($usuario_id){
					$conn = $this->getConnection();
					$sql = "SELECT r.id, rt.descripcion, rt.precio, r.fecha_reserva 
							FROM reservas r 
							JOIN recursos_turisticos rt ON r.recurso_id = rt.id  
							WHERE r.usuario_id = $usuario_id";
					$res = $conn->query($sql);
					$reservas = [];
					while($row = $res->fetch_assoc()){
						$reservas[] = $row;
					}
					$conn->close();
					return $reservas;
				}
				
				public function crearPresupuesto($reserva_id, $total) {
					$conn = $this->getConnection();
					$stmt = $conn->prepare("INSERT INTO presupuestos (reserva_id, total) VALUES (?, ?)");
					$stmt->bind_param("id", $reserva_id, $total);
					$stmt->execute();
					$conn->close();
				}
			
				public function anularReserva($reserva_id){
					$conn = $this->getConnection();
					$conn->query("DELETE FROM presupuestos WHERE reserva_id = $reserva_id");
					$res = $conn->query("DELETE FROM reservas WHERE id = $reserva_id");
					$conn->close();
					return $res;
				}
				
			}

			$reservas = new Reservas();
			if (isset($_POST["registrar"])) {
				$reservas->registrarUsuario($_POST["nombre"], $_POST["email"], $_POST["password"]);
			}			
			$reservas -> formularioRegistro();
			$reservas->mostrarRecursos();

			if (isset($_POST["reservar"])) {
                if (isset($_SESSION["usuario_id"])) {
					$ids = $_POST["recurso_id"]; 
					$total = 0;
			
					foreach ($ids as $id) {
						$reserva_id = $reservas->hacerReserva($_SESSION["usuario_id"], $id);		
						$total += $reserva_id['precio'];  
						$reservas->crearPresupuesto($reserva_id, $reserva_id['precio']);
					}

					
                    echo "<p>Reserva realizada. Presupuesto total: $total.</p>";
                } else {
                    echo "<p>Debes estar registrado para reservar.</p>";
                }
            }		
			
			if (isset($_SESSION["usuario_id"])) {
				$reservas->mostrarReservasUsuario($_SESSION["usuario_id"]);
			} else {
				echo "<p>Debes estar registrado para ver tus reservas.</p>";
			}
			

			if (isset($_POST["anular"])) {
				if (isset($_SESSION["usuario_id"])) {
					$reserva_id = $_POST["reserva_id"]; 
			
					if ($reservas->anularReserva($reserva_id)) {
						echo "<p>Reserva anulada correctamente.</p>";
					} else {
						echo "<p>Error al anular la reserva.</p>";
					}
				} else {
					echo "<p>Debes estar registrado para anular una reserva.</p>";
				}
			}
			
		?>
	</body>
</html>
