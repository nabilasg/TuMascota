<?php
include "conexion.php";

header("Content-Type: application/json");

$id = $_GET["idAdopcion"];

//si tenia foto, la borra del disco
$sqlFoto = "SELECT foto FROM adopcion WHERE idAdopcion = ?";
$stmtFoto = $conexion->prepare($sqlFoto);
$stmtFoto->bind_param("i", $id);
$stmtFoto->execute();
$res = $stmtFoto->get_result()->fetch_assoc();

if ($res && $res["foto"]) {
    $ruta = "fotos/" . $res["foto"];
    if (file_exists($ruta)) unlink($ruta);
}

$sql = "DELETE FROM adopcion WHERE idAdopcion = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
$conexion->close();
?>
