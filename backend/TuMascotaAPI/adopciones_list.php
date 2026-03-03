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

if ($idUsuario) {
    //con idUsuario solo trae sus publicaciones
    $sql = "SELECT a.*, u.nombre AS nombreUsuario 
            FROM adopcion a 
            JOIN usuario u ON a.idUsuario = u.idUsuario 
            WHERE a.idUsuario = ? 
            ORDER BY a.fechaPublicacion DESC";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
} else {
    //sin filtro trae las disponibles
    $sql = "SELECT a.*, u.nombre AS nombreUsuario 
            FROM adopcion a 
            JOIN usuario u ON a.idUsuario = u.idUsuario 
            WHERE a.estado = 'disponible' 
            ORDER BY a.fechaPublicacion DESC";
    $stmt = $conexion->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$adopciones = [];
while ($row = $result->fetch_assoc()) {
    $row['fotoData'] = foto_a_data_url($row['foto'] ?? null);
    $adopciones[] = $row;
}

echo json_encode($adopciones);

$stmt->close();
$conexion->close();
?>
