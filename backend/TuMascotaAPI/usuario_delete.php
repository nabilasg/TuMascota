<?php
include "conexion.php";

header("Content-Type: application/json");

$idUsuario = $_GET['idUsuario'] ?? null;

if (!$idUsuario) {
    echo json_encode(["status" => "error", "mensaje" => "ID de usuario no proporcionado"]);
    exit;
}

$conexion->begin_transaction();

try {
    //busca las mascotas del usuario
    $sqlMascotas = "SELECT idMascota FROM mascota WHERE idDueno = ?";
    $stmtMascotas = $conexion->prepare($sqlMascotas);
    $stmtMascotas->bind_param("i", $idUsuario);
    $stmtMascotas->execute();
    $resultMascotas = $stmtMascotas->get_result();
    
    $idsMascotas = [];
    while ($row = $resultMascotas->fetch_assoc()) {
        $idsMascotas[] = $row['idMascota'];
    }
    $stmtMascotas->close();
    
    //primero borra vacunas y luego mascotas
    if (!empty($idsMascotas)) {
        $placeholders = implode(',', array_fill(0, count($idsMascotas), '?'));
        $sqlVacunas = "DELETE FROM vacunacion_mascota WHERE idMascota IN ($placeholders)";
        $stmtVacunas = $conexion->prepare($sqlVacunas);
        $types = str_repeat('i', count($idsMascotas));
        $stmtVacunas->bind_param($types, ...$idsMascotas);
        $stmtVacunas->execute();
        $stmtVacunas->close();
        
        $sqlDeleteMascotas = "DELETE FROM mascota WHERE idDueno = ?";
        $stmtDeleteMascotas = $conexion->prepare($sqlDeleteMascotas);
        $stmtDeleteMascotas->bind_param("i", $idUsuario);
        $stmtDeleteMascotas->execute();
        $stmtDeleteMascotas->close();
    }
    
    //por ultimo borra el usuario
    $sqlDeleteUsuario = "DELETE FROM usuario WHERE idUsuario = ?";
    $stmtDeleteUsuario = $conexion->prepare($sqlDeleteUsuario);
    $stmtDeleteUsuario->bind_param("i", $idUsuario);
    $stmtDeleteUsuario->execute();
    
    if ($stmtDeleteUsuario->affected_rows > 0) {
        $stmtDeleteUsuario->close();
        $conexion->commit();
        echo json_encode(["status" => "ok", "mensaje" => "Usuario eliminado correctamente"]);
    } else {
        $stmtDeleteUsuario->close();
        $conexion->rollback();
        echo json_encode(["status" => "error", "mensaje" => "No se pudo eliminar el usuario"]);
    }
    
} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(["status" => "error", "mensaje" => "Error al eliminar: " . $e->getMessage()]);
}
?>
