<?php
include "conexion.php";

header("Content-Type: application/json");

$idPaseo = $_GET['idPaseo'];

$sql = "DELETE FROM paseo WHERE idPaseo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idPaseo);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
$conexion->close();
?>
