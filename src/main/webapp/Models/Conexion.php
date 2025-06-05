<?php
//pdo
class conexion{
    public function conectar(){
        //define: permite definir variables
        define('server', "localhost");
        define('db', "soa1");
        define('user', "root");
        define('pass', "");
        //PDO: Obliga a mandar el tipo de caracteres a manejar en la base de datos
        //:: acceder static
        $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND, 'SET NAMES utf8');
        try {
        $con = new PDO("mysql:host=" . server . ";dbname=" . db, user, pass, $opc);
        return $con;
        } catch (Exception $e) {
        die("Error de conexion: ".$e->getMessage());
        }
    }
}
?>