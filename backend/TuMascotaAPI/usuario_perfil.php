<?php
include "conexion.php";

header("Content-Type: application/json");

$idUsuario = $_GET['idUsuario'] ?? null;

if (!$idUsuario) {
    echo json_encode(["status" => "error", "mensaje" => "ID de usuario no proporcionado"]);
    exit;
}

$sql = "SELECT idUsuario, nombre, email, telefono, ciudad, pais FROM usuario WHERE idUsuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado"]);
    $stmt->close();
    exit;
}

$usuario = $result->fetch_assoc();
$stmt->close();

$sqlMascotas = "SELECT COUNT(*) as cantidad FROM mascota WHERE idDueno = ?";
$stmtMascotas = $conexion->prepare($sqlMascotas);
$stmtMascotas->bind_param("i", $idUsuario);
$stmtMascotas->execute();
$resultMascotas = $stmtMascotas->get_result();
$rowMascotas = $resultMascotas->fetch_assoc();
$cantidadMascotas = $rowMascotas['cantidad'] ?? 0;
$stmtMascotas->close();

$sqlMascotasDetalle = "SELECT idMascota, nombre, especie, fechaNacimiento FROM mascota WHERE idDueno = ?";
$stmtDetalle = $conexion->prepare($sqlMascotasDetalle);
$stmtDetalle->bind_param("i", $idUsuario);
$stmtDetalle->execute();
$resultDetalle = $stmtDetalle->get_result();
$mascotas = [];
while ($row = $resultDetalle->fetch_assoc()) {
    $mascotas[] = $row;
}
$stmtDetalle->close();

$especies = [];
foreach ($mascotas as $m) {
    //normaliza para no duplicar "pato", "Pato" y "PATO"
    $esp = $m['especie'] ?? 'Desconocida';
    $esp = trim($esp);
    if ($esp === '') {
        $esp = 'Desconocida';
    }
    $espNormalizada = ucfirst(strtolower($esp));
    $especies[$espNormalizada] = ($especies[$espNormalizada] ?? 0) + 1;
}

//vacunas en los proximos 30 dias
$fechaProxima = date('Y-m-d', strtotime('+30 days'));
$sqlVacunas = "SELECT COUNT(*) as cantidad 
               FROM vacunacion_mascota vm
               INNER JOIN mascota m ON vm.idMascota = m.idMascota
               WHERE m.idDueno = ? AND vm.fechaProxima <= ? AND vm.fechaProxima >= CURDATE()";
$stmtVacunas = $conexion->prepare($sqlVacunas);
$stmtVacunas->bind_param("is", $idUsuario, $fechaProxima);
$stmtVacunas->execute();
$resultVacunas = $stmtVacunas->get_result();
$rowVacunas = $resultVacunas->fetch_assoc();
$vacunasProximas = $rowVacunas['cantidad'] ?? 0;
$stmtVacunas->close();

//vacunas ya vencidas
$sqlVacunasVencidas = "SELECT COUNT(*) as cantidad 
                       FROM vacunacion_mascota vm
                       INNER JOIN mascota m ON vm.idMascota = m.idMascota
                       WHERE m.idDueno = ? AND vm.fechaProxima < CURDATE()";
$stmtVacunasVencidas = $conexion->prepare($sqlVacunasVencidas);
$stmtVacunasVencidas->bind_param("i", $idUsuario);
$stmtVacunasVencidas->execute();
$resultVacunasVencidas = $stmtVacunasVencidas->get_result();
$rowVacunasVencidas = $resultVacunasVencidas->fetch_assoc();
$vacunasVencidas = $rowVacunasVencidas['cantidad'] ?? 0;
$stmtVacunasVencidas->close();

echo json_encode([
    "status" => "ok",
    "usuario" => $usuario,
    "cantidadMascotas" => $cantidadMascotas,
    "especies" => $especies,
    "vacunasProximas" => $vacunasProximas,
    "vacunasVencidas" => $vacunasVencidas
]);
?>
