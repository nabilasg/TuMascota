<?php
include "conexion.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data)) {
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos"]);
    exit;
}

$nombre = $data['nombre'] ?? null;
$email  = $data['email'] ?? null;
$passwordRaw = $data['password'] ?? null;
$telefono = $data['telefono'] ?? null;
$ciudad = $data['ciudad'] ?? null;
$pais = $data['pais'] ?? null;

if (!$nombre || !$email || !$passwordRaw) {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos obligatorios"]);
    exit;
}

$checkEmail = $conexion->prepare("SELECT idUsuario FROM usuario WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "mensaje" => "Este email ya está registrado."]);
    $checkEmail->close();
    exit;
}
$checkEmail->close();

$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuario (nombre, email, passwordHash, telefono, ciudad, pais)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssssss", $nombre, $email, $password, $telefono, $ciudad, $pais);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "mensaje" => "Usuario registrado"]);
} else {
    $errorCode = $stmt->errno;
    if ($errorCode == 1062) {
        echo json_encode(["status" => "error", "mensaje" => "Este email ya está registrado."]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al registrar: " . $stmt->error]);
    }
}
$stmt->close();
?>
