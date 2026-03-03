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

$id = $_GET["idMascota"] ?? 0;

$sql = "SELECT * FROM mascota WHERE idMascota = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$mascota = $result->fetch_assoc();
if ($mascota) {
    $mascota['fotoData'] = foto_a_data_url($mascota['foto'] ?? null);
}

echo json_encode($mascota);
$stmt->close();
$conexion->close();
?>
