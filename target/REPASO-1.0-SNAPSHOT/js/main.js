$(document).ready(function () {
  cargarDatos();

  $("#btn-insertar").on("click", function () {
    $("#usuarioModalLabel").text("Add User");
    $("#form-usuario")[0].reset();
    $("#form-usuario").attr("data-modo", "crear");
    $('input[name="cedula"]').prop("readonly", false);
  });

  $(document).on("click", ".edit-btn", function () {
    const row = $(this).closest("tr");
    $("#usuarioModalLabel").text("Editar Usuario");
    $("#form-usuario")[0].reset();
    $('input[name="cedula"]').val(row.data("cedula")).prop("readonly", true);
    $('input[name="nombre"]').val(row.find("td:eq(1)").text());
    $('input[name="apellido"]').val(row.find("td:eq(2)").text());
    $('input[name="direccion"]').val(row.find("td:eq(3)").text());
    $('input[name="telefono"]').val(row.find("td:eq(4)").text());
    $("#form-usuario").attr("data-modo", "editar");
  });
  
  $("#form-usuario").on("submit", function (e) {
    e.preventDefault();

    const modo = $(this).attr("data-modo");
    const formData = {
      cedula: $('input[name="cedula"]').val(),
      nombre: $('input[name="nombre"]').val(),
      apellido: $('input[name="apellido"]').val(),
      direccion: $('input[name="direccion"]').val(),
      telefono: $('input[name="telefono"]').val(),
    };

    const cerrarModal = () => {
      const modalElement = document.getElementById("usuarioModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    };

    if (modo === "editar") {
      $.ajax({
        url: "/REPASO/UserController",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
          console.log("Usuario actualizado");
          $("#form-usuario")[0].reset();
          cargarDatos();
          cerrarModal();
        },
        error: function () {
          console.error("Error al actualizar usuario");
        },
      });
    } else {
      $.ajax({
        url: "/REPASO/UserController",
        type: "POST",
        contentType: "application/json",  // <--- Aquí está la corrección para POST
        data: JSON.stringify(formData),    // Enviar JSON como string
        success: function () {
          console.log("Usuario agregado");
          $("#form-usuario")[0].reset();
          cargarDatos();
          cerrarModal();
        },
        error: function () {
          console.error("Error al agregar usuario");
        },
      });
    }
  });
});

function cargarDatos() {
  $.ajax({
    url: "/REPASO/UserController",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const tbody = $("#tabla-bootstrap tbody");
      tbody.empty();

      data.forEach(function (item) {
        const row = `
              <tr data-cedula="${item.cedula}">
                <td>${item.cedula}</td>
                <td>${item.nombre}</td>
                <td>${item.apellido}</td>
                <td>${item.direccion}</td>
                <td>${item.telefono}</td>
                <td>
                  <button class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#usuarioModal"><i class="bi bi-pen-fill"></i></button>
                  <button class="btn btn-sm btn-danger" onclick="deleteUser('${item.cedula}')"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>
            `;
        tbody.append(row);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar datos:", error);
    },
  });
}

function deleteUser(cedula) {
  if (
    !confirm(
      "¿Seguro que quieres eliminar al usuario con cédula " + cedula + "?"
    )
  )
    return;
  $.ajax({
    url: "/REPASO/UserController?cedula=" + encodeURIComponent(cedula),
    type: "DELETE",
    success: function () {
      cargarDatos();
    },
    error: function () {
      console.error("Error al eliminar usuario");
    },
  });
}
$(document).ready(function () {
  // Carga inicial de todos los usuarios
  cargarDatos();

  // Evento botón buscar
  $("#btn-buscar").on("click", function () {
    const cedula = $("#input-buscar-cedula").val().trim();
    if (cedula === "") {
      alert("Ingrese una cédula para buscar");
      return;
    }
    buscarPorCedula(cedula);
  });

  // Evento botón limpiar: recarga toda la tabla y limpia input
  $("#btn-limpiar").on("click", function () {
    $("#input-buscar-cedula").val("");
    cargarDatos();
  });
});

// Función para buscar usuario por cédula (consulta al backend)
function buscarPorCedula(cedula) {
  $.ajax({
    url: `/REPASO/UserController?cedula=${encodeURIComponent(cedula)}`,
    type: "GET",
    dataType: "json",
    success: function (data) {
      const tbody = $("#tabla-bootstrap tbody");
      tbody.empty();

      if (!data || (Array.isArray(data) && data.length === 0)) {
        tbody.append(
          `<tr><td colspan="6" class="text-center">No se encontró usuario con cédula ${cedula}</td></tr>`
        );
        return;
      }

      // Si el backend devuelve un objeto (usuario único) o lista con un solo usuario
      let usuarios = [];
      if (Array.isArray(data)) {
        usuarios = data;
      } else {
        usuarios = [data];
      }

      usuarios.forEach(function (item) {
        const row = `
          <tr data-cedula="${item.cedula}">
            <td>${item.cedula}</td>
            <td>${item.nombre}</td>
            <td>${item.apellido}</td>
            <td>${item.direccion}</td>
            <td>${item.telefono}</td>
            <td>
              <button class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#usuarioModal"><i class="bi bi-pen-fill"></i></button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser('${item.cedula}')"><i class="bi bi-trash-fill"></i></button>
            </td>
          </tr>
        `;
        tbody.append(row);
      });
    },
    error: function () {
      alert("Error al buscar usuario. Intente de nuevo.");
    },
  });
}


