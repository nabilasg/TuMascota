<?php
include "conexion.php";

header("Content-Type: application/json");

$idMascota = $_POST["idMascota"];
$nombre = $_POST["nombre"];
$especie = $_POST["especie"];
$raza = $_POST["raza"];
$fecha = $_POST["fechaNacimiento"];

$fotoNombre = null;

if (!empty($_FILES["foto"]["name"])) {
    $ext = pathinfo($_FILES["foto"]["name"], PATHINFO_EXTENSION);
    $fotoNombre = "mascota_" . uniqid() . "." . $ext;
    move_uploaded_file($_FILES["foto"]["tmp_name"], "fotos/" . $fotoNombre);

    $sql = "UPDATE mascota SET nombre=?, especie=?, raza=?, fechaNacimiento=?, foto=? WHERE idMascota=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssssi", $nombre, $especie, $raza, $fecha, $fotoNombre, $idMascota);
} else {
    $sql = "UPDATE mascota SET nombre=?, especie=?, raza=?, fechaNacimiento=? WHERE idMascota=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssssi", $nombre, $especie, $raza, $fecha, $idMascota);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>
