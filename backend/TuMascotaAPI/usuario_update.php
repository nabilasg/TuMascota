<?php
include "conexion.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data)) {
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos"]);
    exit;
}

$idUsuario = $data['idUsuario'] ?? null;
$nombre = $data['nombre'] ?? null;
$telefono = $data['telefono'] ?? null;
$ciudad = $data['ciudad'] ?? null;
$pais = $data['pais'] ?? null;

if (!$idUsuario) {
    echo json_encode(["status" => "error", "mensaje" => "ID de usuario no proporcionado"]);
    exit;
}

if (!$nombre || trim($nombre) === '') {
    echo json_encode(["status" => "error", "mensaje" => "El nombre es obligatorio"]);
    exit;
}

$campos = [];
$valores = [];
$tipos = "";

if ($nombre !== null) {
    $campos[] = "nombre = ?";
    $valores[] = $nombre;
    $tipos .= "s";
}

if ($telefono !== null) {
    $campos[] = "telefono = ?";
    $valores[] = $telefono;
    $tipos .= "s";
} else {
    $campos[] = "telefono = NULL";
}

if ($ciudad !== null) {
    $campos[] = "ciudad = ?";
    $valores[] = $ciudad;
    $tipos .= "s";
} else {
    $campos[] = "ciudad = NULL";
}

if ($pais !== null) {
    $campos[] = "pais = ?";
    $valores[] = $pais;
    $tipos .= "s";
} else {
    $campos[] = "pais = NULL";
}

if (empty($campos)) {
    echo json_encode(["status" => "error", "mensaje" => "No hay datos para actualizar"]);
    exit;
}

$sql = "UPDATE usuario SET " . implode(", ", $campos) . " WHERE idUsuario = ?";
$valores[] = $idUsuario;
$tipos .= "i";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "mensaje" => "Error en la consulta: " . $conexion->error]);
    exit;
}

$stmt->bind_param($tipos, ...$valores);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "ok", "mensaje" => "Usuario actualizado correctamente"]);
    } else {
        echo json_encode(["status" => "ok", "mensaje" => "No se realizaron cambios"]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Error al actualizar: " . $stmt->error]);
}

$stmt->close();
?>
