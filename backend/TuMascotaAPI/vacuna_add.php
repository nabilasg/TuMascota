<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$fechaAplicacion = $_POST['fechaAplicacion'] ?? '';
$fechaProxima = $_POST['fechaProxima'] ?? '';
$idMascota = $_POST['idMascota'] ?? '';
$idVacuna = $_POST['idVacuna'] ?? '';

if (empty($fechaAplicacion) || empty($idMascota) || empty($idVacuna) || $idVacuna == '0' || $idVacuna == 0) {
    echo json_encode([
        "status" => "error", 
        "message" => "Faltan datos obligatorios"
    ]);
    exit();
}

$idMascota = (int)$idMascota;
$idVacuna = (int)$idVacuna;

$sql = "INSERT INTO vacunacion_mascota (fechaAplicacion, fechaProxima, idMascota, idVacuna)
        VALUES (?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la consulta: " . $conexion->error]);
    exit();
}

$stmt->bind_param("ssii", $fechaAplicacion, $fechaProxima, $idMascota, $idVacuna);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "message" => "Vacuna guardada correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
