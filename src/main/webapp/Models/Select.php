<?php
include_once 'Conexion.php';
class crudSelect {
    public static function seleccionarEstudiante() {
        $object = new Conexion();
        $conn=$object->conectar();
        $result = $conn->query("SELECT * FROM estudiantes");
        
        if ($result) {
            $data = [];
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(["errorMsg" => "Error loading data"]);
        }
    }
}
?>