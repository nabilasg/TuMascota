<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idPaseo = $_GET['idPaseo'] ?? null;

if (!$idPaseo) {
    echo json_encode(["error" => "idPaseo requerido"]);
    exit();
}

$sql = "SELECT p.*, m.nombre AS mascotaNombre
        FROM paseo p
        INNER JOIN mascota m ON m.idMascota = p.idMascota
        WHERE p.idPaseo = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idPaseo);
$stmt->execute();
$result = $stmt->get_result();

$paseo = $result->fetch_assoc();

if ($paseo) {
    echo json_encode($paseo);
} else {
    echo json_encode(["error" => "Paseo no encontrado"]);
}

$stmt->close();
$conexion->close();
?>
