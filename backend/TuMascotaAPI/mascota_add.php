<?php
include "conexion.php";

header("Content-Type: application/json");

$nombre = trim($_POST['nombre'] ?? '');
$especie = trim($_POST['especie'] ?? '');
$raza = trim($_POST['raza'] ?? '');
$fecha = trim($_POST['fechaNacimiento'] ?? '');
$idDueno = intval($_POST['idDueno'] ?? 0);

if ($nombre === '' || $especie === '' || $raza === '' || $fecha === '' || $idDueno <= 0) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Faltan datos obligatorios para guardar la mascota."
    ]);
    exit;
}

$fotoNombre = null;

if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $fotoNombre = uniqid("mascota_") . "." . $extension;
    $rutaDestino = __DIR__ . "/fotos/" . $fotoNombre;
    move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino);
}

$sql = "INSERT INTO mascota (nombre, especie, raza, fechaNacimiento, idDueno, foto)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "No se pudo preparar la consulta SQL."
    ]);
    exit;
}

$stmt->bind_param("ssssis", $nombre, $especie, $raza, $fecha, $idDueno, $fotoNombre);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => $stmt->error
    ]);
}

$stmt->close();
$conexion->close();

?>
