<?php
include "conexion.php";

header("Content-Type: application/json");

$idUsuario = $_POST['idUsuario'];
$nombreMascota = $_POST['nombreMascota'];
$especie = $_POST['especie'];
$raza = $_POST['raza'] ?? '';
$edad = $_POST['edad'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$contacto = $_POST['contacto'];

//si llega foto, la guarda
$fotoNombre = null;
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $fotoNombre = uniqid("adopcion_") . "." . $extension;
    $rutaDestino = __DIR__ . "/fotos/" . $fotoNombre;
    move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino);
}

$sql = "INSERT INTO adopcion (idUsuario, nombreMascota, especie, raza, edad, descripcion, contacto, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("isssssss", $idUsuario, $nombreMascota, $especie, $raza, $edad, $descripcion, $contacto, $fotoNombre);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "mensaje" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
