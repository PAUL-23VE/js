<?php
include_once 'Conexion.php';
class crudDelete {
    public static function eliminarEstudiante($cedula) {
        $object = new Conexion();
        $conn=$object->conectar();
        $stmt = $conn->prepare("DELETE FROM estudiantes WHERE cedula = ?");
        $stmt->bindValue(1, $cedula, PDO::PARAM_STR);
        
        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["errorMsg" => "Error deleting data: " . implode(" ", $stmt->errorInfo())];
        }
    }
}
?>