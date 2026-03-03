<?php
include "conexion.php";
header("Content-Type: application/json");

function foto_a_data_url($nombreFoto) {
    if (!$nombreFoto) return null;
    $ruta = __DIR__ . "/fotos/" . $nombreFoto;
    if (!is_file($ruta)) return null;

    $extension = strtolower(pathinfo($ruta, PATHINFO_EXTENSION));
    $mime = "image/jpeg";
    if ($extension === "png") $mime = "image/png";
    if ($extension === "gif") $mime = "image/gif";
    if ($extension === "webp") $mime = "image/webp";

    $contenido = @file_get_contents($ruta);
    if ($contenido === false) return null;

    return "data:" . $mime . ";base64," . base64_encode($contenido);
}

$idUsuario = $_GET['idUsuario'] ?? null;

if (!$idUsuario) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT * FROM mascota WHERE idDueno = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

$mascotas = [];

while ($row = $result->fetch_assoc()) {
    $row['fotoData'] = foto_a_data_url($row['foto'] ?? null);
    $mascotas[] = $row;
}

echo json_encode($mascotas);
$stmt->close();
$conexion->close();
?>
