<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idMascota = $_POST['idMascota'] ?? '';
$fecha = $_POST['fecha'] ?? '';
$duracionMinutos = $_POST['duracionMinutos'] ?? 0;
$distanciaKm = $_POST['distanciaKm'] ?? null;
$lugar = $_POST['lugar'] ?? '';
$notas = $_POST['notas'] ?? '';

if (empty($idMascota) || empty($fecha) || empty($duracionMinutos)) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios (mascota, fecha, duración)"
    ]);
    exit();
}

$idMascota = (int)$idMascota;
$duracionMinutos = (int)$duracionMinutos;
$distanciaKm = ($distanciaKm !== null && $distanciaKm !== '') ? (float)$distanciaKm : null;

$sql = "INSERT INTO paseo (idMascota, fecha, duracionMinutos, distanciaKm, lugar, notas)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la consulta: " . $conexion->error]);
    exit();
}

$stmt->bind_param("isidss", $idMascota, $fecha, $duracionMinutos, $distanciaKm, $lugar, $notas);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "message" => "Paseo registrado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
