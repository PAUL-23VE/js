$(document).ready(function () {
    cargarUsuarios();
});

function cargarUsuarios() {
    $.ajax({
        url: 'http://localhost/SERVICIOS/SOA1/Controllers/ApiRest.php',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            if (typeof displayData === 'function') {
                displayData(data);
            } else {
                console.error("displayData function not found");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading data:", error);
            alert("Error loading data: " + error);
        }
    });
}

function guardarUsuario(datos, esNuevo, callback) {
    let url = 'http://localhost/SERVICIOS/SOA1/Controllers/ApiRest.php';

    if (!esNuevo) {
        url += '?cedula=' + datos.cedula + '&_method=PUT';
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(datos), // <-- convertir a JSON
        contentType: "application/json", // <-- muy importante
        success: function (resultado) {
            callback(resultado);
        },
        error: function (xhr, status, error) {
            console.error("Error saving data:", error);
            callback({ errorMsg: 'Error al guardar los datos: ' + error });
        }
    });
}


function eliminarUsuario(cedula, callback) {
    $.ajax({
        url: 'http://localhost/SERVICIOS/SOA1/Controllers/ApiRest.php?cedula=' + cedula + '&_method=DELETE',
        type: 'POST',
        success: function (resultado) {
            callback(resultado);
        },
        error: function (xhr, status, error) {
            console.error("Error deleting user:", error);
            callback({errorMsg: 'Error al eliminar el usuario: ' + error});
        }
    });
}

function cargarUsuario(cedula, callback) {
    $.ajax({
        url: 'http://localhost/SERVICIOS/SOA1/Controllers/ApiRest.php?cedula=' + cedula,
        type: 'GET',
        dataType: 'json',
        success: function (resultado) {
            callback(resultado);
        },
        error: function (xhr, status, error) {
            console.error("Error loading user:", error);
            callback({errorMsg: 'Error al cargar el usuario: ' + error});
        }
    });
}