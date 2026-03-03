<?php
include "conexion.php";

header("Content-Type: application/json");

$idAdopcion = $_POST['idAdopcion'];
$nombreMascota = $_POST['nombreMascota'];
$especie = $_POST['especie'];
$raza = $_POST['raza'] ?? '';
$edad = $_POST['edad'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$contacto = $_POST['contacto'];
$estado = $_POST['estado'] ?? 'disponible';

$fotoNombre = null;

//si llega foto nueva, reemplaza la anterior
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $sqlFoto = "SELECT foto FROM adopcion WHERE idAdopcion = ?";
    $stmtFoto = $conexion->prepare($sqlFoto);
    $stmtFoto->bind_param("i", $idAdopcion);
    $stmtFoto->execute();
    $resFoto = $stmtFoto->get_result()->fetch_assoc();

    if ($resFoto && $resFoto["foto"]) {
        $rutaVieja = "fotos/" . $resFoto["foto"];
        if (file_exists($rutaVieja)) unlink($rutaVieja);
    }

    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $fotoNombre = uniqid("adopcion_") . "." . $extension;
    move_uploaded_file($_FILES['foto']['tmp_name'], __DIR__ . "/fotos/" . $fotoNombre);
}

if ($fotoNombre) {
    $sql = "UPDATE adopcion SET nombreMascota=?, especie=?, raza=?, edad=?, descripcion=?, contacto=?, estado=?, foto=? WHERE idAdopcion=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssssssssi", $nombreMascota, $especie, $raza, $edad, $descripcion, $contacto, $estado, $fotoNombre, $idAdopcion);
} else {
    $sql = "UPDATE adopcion SET nombreMascota=?, especie=?, raza=?, edad=?, descripcion=?, contacto=?, estado=? WHERE idAdopcion=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssssssi", $nombreMascota, $especie, $raza, $edad, $descripcion, $contacto, $estado, $idAdopcion);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "mensaje" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
