<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idVacunacion = $_GET['idVacunacion'] ?? null;

if (!$idVacunacion) {
    echo json_encode(["error" => "idVacunacion requerido"]);
    exit();
}

$sql = "SELECT vm.*, v.nombre AS vacunaNombre, v.descripcion, m.nombre AS mascotaNombre
        FROM vacunacion_mascota vm
        INNER JOIN vacuna v ON v.idVacuna = vm.idVacuna
        INNER JOIN mascota m ON m.idMascota = vm.idMascota
        WHERE vm.idVacunacion = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idVacunacion);
$stmt->execute();
$result = $stmt->get_result();

$vacuna = $result->fetch_assoc();

if ($vacuna) {
    echo json_encode($vacuna);
} else {
    echo json_encode(["error" => "Vacuna no encontrada"]);
}

$stmt->close();
$conexion->close();
?>
