<?php
include "conexion.php";

header("Content-Type: application/json");

$id = $_GET["idMascota"];

//si tenia foto, la borra del disco
$sqlFoto = "SELECT foto FROM mascota WHERE idMascota = ?";
$stmtFoto = $conexion->prepare($sqlFoto);
$stmtFoto->bind_param("i", $id);
$stmtFoto->execute();
$res = $stmtFoto->get_result()->fetch_assoc();

if ($res && $res["foto"]) {
    $ruta = "fotos/" . $res["foto"];
    if (file_exists($ruta)) unlink($ruta);
}

$sqlDel = "DELETE FROM mascota WHERE idMascota = ?";
$stmtDel = $conexion->prepare($sqlDel);
$stmtDel->bind_param("i", $id);

if ($stmtDel->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>
