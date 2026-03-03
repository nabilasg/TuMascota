<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$sql = "SELECT * FROM vacuna";
$result = $conexion->query($sql);

$vacunas = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $vacunas[] = $row;
    }
}

echo json_encode($vacunas);
?>
