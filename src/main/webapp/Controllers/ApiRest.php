|<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST' && isset($_GET['_method'])) {
    $method = $_GET['_method'];
}

switch ($method) {
    case 'GET':
        if (isset($_GET['cedula'])) {
            $cedula = $_GET['cedula'];
            include_once '../models/search.php';
            search::search($cedula);

        } else {
            include_once '../models/SELECT.php';

            crudselect::seleccionarEstudiante();
        }
        break;
    case 'POST':
        include_once '../Models/Insert.php';
        $inputJSON = file_get_contents('php://input');
        $data = json_decode($inputJSON, true);

        if ($data) {
            // Leer desde JSON
            $cedula = $data['cedula'] ?? null;
            $nombre = $data['nombre'] ?? null;
            $apellido = $data['apellido'] ?? null;
            $telefono = $data['telefono'] ?? null;
            $direccion = $data['direccion'] ?? null;
        } else {
            // Leer desde formulario tradicional
            $cedula = $_POST['cedula'] ?? null;
            $nombre = $_POST['nombre'] ?? null;
            $apellido = $_POST['apellido'] ?? null;
            $telefono = $_POST['telefono'] ?? null;
            $direccion = $_POST['direccion'] ?? null;
        }

        if (!$cedula || !$nombre) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            exit;
        }

        $result = crudInsert::insertarEstudiante($cedula, $nombre, $apellido, $telefono, $direccion);
        echo json_encode($result);
        break;
    case 'PUT':
        include_once '../Models/Update.php';

        // Leer el cuerpo JSON de la petición
        $json = file_get_contents('php://input');

        // Decodificar JSON a array asociativo
        $data = json_decode($json, true);

        // Verificar que la decodificación fue exitosa y que los datos existen
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            $cedula = isset($data['cedula']) ? $data['cedula'] : (isset($_GET['cedula']) ? $_GET['cedula'] : null);
            $nombre = isset($data['nombre']) ? $data['nombre'] : null;
            $apellido = isset($data['apellido']) ? $data['apellido'] : null;
            $telefono = isset($data['telefono']) ? $data['telefono'] : null;
            $direccion = isset($data['direccion']) ? $data['direccion'] : null;

            if ($cedula && $nombre && $apellido && $telefono && $direccion) {
                $result = crudUpdate::actualizarEstudiante($cedula, $nombre, $apellido, $telefono, $direccion);
                echo json_encode($result);
            } else {
                // Algún dato no fue enviado
                echo json_encode([
                    'success' => false,
                    'message' => 'Faltan datos requeridos',
                    'data' => $data
                ]);
            }
        } else {
            // Error al decodificar JSON
            echo json_encode(['success' => false, 'message' => 'JSON inválido']);
        }
        break;
    case 'DELETE':
        $json = file_get_contents('php://input');

        include_once '../Models/Delete.php';
        $cedula = $_GET['cedula'];
        $result = crudDelete::eliminarEstudiante($cedula);
        echo json_encode(value: $result);
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>