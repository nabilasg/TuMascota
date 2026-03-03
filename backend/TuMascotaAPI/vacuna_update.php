<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idVacunacion = $_POST['idVacunacion'] ?? null;
$fechaAplicacion = $_POST['fechaAplicacion'] ?? null;
$fechaProxima = $_POST['fechaProxima'] ?? '';
$idVacuna = $_POST['idVacuna'] ?? null;

if (!$idVacunacion || !$fechaAplicacion || !$idVacuna || $idVacuna == '0') {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios"
    ]);
    exit();
}

$idVacunacion = (int)$idVacunacion;
$idVacuna = (int)$idVacuna;

$sql = "UPDATE vacunacion_mascota 
        SET fechaAplicacion = ?, fechaProxima = ?, idVacuna = ?
        WHERE idVacunacion = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Error en la consulta: " . $conexion->error
    ]);
    exit();
}

$stmt->bind_param("ssii", $fechaAplicacion, $fechaProxima, $idVacuna, $idVacunacion);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "ok",
        "message" => "Vacuna actualizada correctamente"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Error al actualizar: " . $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
