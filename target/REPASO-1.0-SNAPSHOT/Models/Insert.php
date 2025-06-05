<?php
include_once 'Conexion.php';
class crudInsert {
    public static function insertarEstudiante($cedula, $nombre, $apellido, $telefono, $direccion) {
        $object = new Conexion();
        $conn=$object->conectar();
        $stmt = $conn->prepare("INSERT INTO estudiantes (cedula, nombre, apellido, telefono, direccion) VALUES (:cedula, :nombre, :apellido, :telefono, :direccion)");
        $stmt->bindValue(':cedula', $cedula, PDO::PARAM_STR);
        $stmt->bindValue(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindValue(':apellido', $apellido, PDO::PARAM_STR);
        $stmt->bindValue(':telefono', $telefono, PDO::PARAM_STR);
        $stmt->bindValue(':direccion', $direccion, PDO::PARAM_STR);
        
        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["errorMsg" => "Error inserting data: " . implode(" ", $stmt->errorInfo())];
        }
    }
}
?>