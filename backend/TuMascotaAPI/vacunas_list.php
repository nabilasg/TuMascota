<?php
include "conexion.php";

header("Content-Type: application/json; charset=UTF-8");

$idMascota = $_GET['idMascota'] ?? null;
$idUsuario = $_GET['idUsuario'] ?? null;

if ($idMascota && $idMascota != 0) {
    $sql = "SELECT vm.idVacunacion, vm.fechaAplicacion, vm.fechaProxima,
                   v.nombre AS vacunaNombre, v.descripcion, m.nombre AS mascotaNombre
            FROM vacunacion_mascota vm
            INNER JOIN vacuna v ON v.idVacuna = vm.idVacuna
            INNER JOIN mascota m ON m.idMascota = vm.idMascota
            WHERE vm.idMascota = ?";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idMascota);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $vacunas = [];
    while($row = $result->fetch_assoc()){
        $vacunas[] = $row;
    }
    
    echo json_encode($vacunas);
    $stmt->close();
}
else if ($idUsuario && $idUsuario != 0) {
    $sql = "SELECT vm.idVacunacion, vm.fechaAplicacion, vm.fechaProxima,
                   v.nombre AS vacunaNombre, v.descripcion, m.nombre AS mascotaNombre
            FROM vacunacion_mascota vm
            INNER JOIN vacuna v ON v.idVacuna = vm.idVacuna
            INNER JOIN mascota m ON m.idMascota = vm.idMascota
            WHERE m.idDueno = ?
            ORDER BY m.nombre, vm.fechaAplicacion DESC";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $vacunas = [];
    while($row = $result->fetch_assoc()){
        $vacunas[] = $row;
    }
    
    echo json_encode($vacunas);
    $stmt->close();
}
else {
    echo json_encode([]);
}

$conexion->close();
?>
