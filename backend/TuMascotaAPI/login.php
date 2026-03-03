<?php
include "conexion.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$pass = trim($data['password'] ?? '');

if ($email === '' || $pass === '') {
    echo json_encode(["status" => "error", "mensaje" => "Email y contraseña son obligatorios"]);
    exit;
}

$sql = "SELECT * FROM usuario WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {

    $user = $result->fetch_assoc();

    if (password_verify($pass, $user['passwordHash'])) {

        echo json_encode([
            "status" => "ok",
            "idUsuario" => $user["idUsuario"],
            "nombre" => $user["nombre"]
        ]);

    } else {
        echo json_encode(["status" => "error", "mensaje" => "Contraseña incorrecta"]);
    }

} else {
    echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado"]);
}

$stmt->close();
$conexion->close();

?>
