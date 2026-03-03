<?php
include "conexion.php";

header("Content-Type: application/json");

$idVacunacion = $_GET['idVacunacion'];

$sql = "DELETE FROM vacunacion_mascota WHERE idVacunacion = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idVacunacion);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>
