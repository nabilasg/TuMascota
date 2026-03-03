<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idPaseo = $_POST['idPaseo'] ?? null;
$fecha = $_POST['fecha'] ?? null;
$duracionMinutos = $_POST['duracionMinutos'] ?? null;
$distanciaKm = $_POST['distanciaKm'] ?? null;
$lugar = $_POST['lugar'] ?? '';
$notas = $_POST['notas'] ?? '';

if (!$idPaseo || !$fecha || !$duracionMinutos) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios"
    ]);
    exit();
}

$idPaseo = (int)$idPaseo;
$duracionMinutos = (int)$duracionMinutos;
$distanciaKm = ($distanciaKm !== null && $distanciaKm !== '') ? (float)$distanciaKm : null;

$sql = "UPDATE paseo 
        SET fecha = ?, duracionMinutos = ?, distanciaKm = ?, lugar = ?, notas = ?
        WHERE idPaseo = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la consulta: " . $conexion->error]);
    exit();
}

$stmt->bind_param("sidssi", $fecha, $duracionMinutos, $distanciaKm, $lugar, $notas, $idPaseo);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "message" => "Paseo actualizado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
