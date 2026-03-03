<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idUsuario = $_GET['idUsuario'] ?? null;

if (!$idUsuario || $idUsuario == 0) {
    echo json_encode([]);
    exit();
}

$sql = "SELECT p.idPaseo, p.fecha, p.duracionMinutos, p.distanciaKm, p.lugar, p.notas,
               m.nombre AS mascotaNombre
        FROM paseo p
        INNER JOIN mascota m ON m.idMascota = p.idMascota
        WHERE m.idDueno = ?
        ORDER BY p.fecha DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

$paseos = [];
while ($row = $result->fetch_assoc()) {
    $paseos[] = $row;
}

echo json_encode($paseos);

$stmt->close();
$conexion->close();
?>
