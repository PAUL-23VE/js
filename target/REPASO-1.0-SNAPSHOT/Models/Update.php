<?php
include_once 'Conexion.php';
class crudUpdate {
    public static function actualizarEstudiante($cedula, $nombre, $apellido, $telefono, $direccion) {
        $object = new Conexion();
        $conn=$object->conectar();
        $stmt = $conn->prepare("UPDATE estudiantes SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE cedula = ?");
        $stmt->bindValue(1, $nombre, PDO::PARAM_STR);
        $stmt->bindValue(2, $apellido, PDO::PARAM_STR);
        $stmt->bindValue(3, $telefono, PDO::PARAM_STR);
        $stmt->bindValue(4, $direccion, PDO::PARAM_STR);
        $stmt->bindValue(5, $cedula, PDO::PARAM_STR);
        
        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["errorMsg" => "Error updating data: " . implode(" ", $stmt->errorInfo())];
        }
    }
}
?>