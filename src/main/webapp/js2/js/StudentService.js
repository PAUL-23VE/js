const API_BASE = 'http://localhost/SERVICIOS/SOA1/Controllers/ApiRest.php';
let url;
let selectedRow = null;

$(document).ready(() => {
    loadData();
});

function showToast(message, type = 'primary') {
    const toastEl = $('#toastMsg');
    $('#toastBody').text(message);
    toastEl.removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
    new bootstrap.Toast(toastEl[0]).show();
}

function showConfirm(message, onConfirm) {
    $('#confirmMessage').text(message);
    const confirmBtn = $('#confirmBtn');
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

    confirmBtn.off('click').on('click', () => {
        confirmModal.hide();
        onConfirm();
    });

    confirmModal.show();
}

function loadData() {
    $.ajax({
        url: API_BASE,
        type: "GET",
        dataType: "json",
        success: function(data) {
            const tbody = $('#userTableBody');
            tbody.empty();
            data.forEach(user => {
                const row = $('<tr></tr>').click(() => selectRow(row, user));
                row.append(`<td>${user.cedula}</td>`);
                row.append(`<td>${user.nombre}</td>`);
                row.append(`<td>${user.apellido}</td>`);
                row.append(`<td>${user.direccion}</td>`);
                row.append(`<td>${user.telefono}</td>`);
                tbody.append(row);
            });
        },
        error: function(xhr) {
            showToast('Failed to load data: ' + xhr.responseText, 'danger');
        }
    });
}

function selectRow(rowElement, rowData) {
    $('#userTable tbody tr').removeClass('table-active');
    $(rowElement).addClass('table-active');
    selectedRow = rowData;
}

function newUser() {
    $('#fm')[0].reset();
    selectedRow = null;
    $('[name="cedula"]').prop('disabled', false);

    url = API_BASE;
    $('#modalTitle').text('New User');
    new bootstrap.Modal(document.getElementById('userModal')).show();
}


function editUser() {
    if (!selectedRow) {
        showToast('Please select a user first.', 'warning');
        return;
    }
    $('#fm')[0].reset();
    for (let key in selectedRow) {
        $(`[name="${key}"]`).val(selectedRow[key]);
    }
    $('[name="cedula"]').prop('disabled', true);

    url = `${API_BASE}?cedula=${selectedRow.cedula}`;
    $('#modalTitle').text('Edit User');
    new bootstrap.Modal(document.getElementById('userModal')).show();
}


function saveUser() {
    const formData = $('#fm').serializeArray();
    const dataObj = {};
    formData.forEach(item => {
        dataObj[item.name] = item.value;
    });

    const isEdit = url.includes('cedula=');
    const method = isEdit ? 'PUT' : 'POST';

    $.ajax({
        url: url,
        type: method,
        data: JSON.stringify(dataObj),
        contentType: 'application/json',
        success: function() {
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            loadData();
            showToast(isEdit ? 'User updated successfully.' : 'User created successfully.', 'success');
        },
        error: function(xhr) {
            showToast('Failed to save user: ' + xhr.responseText, 'danger');
        }
    });
}

function proxyDestroyUser() {
    if (!selectedRow) {
        showToast('Please select a user first.', 'warning');
        return;
    }
    showConfirm('Are you sure you want to delete this user?', () => {
        destroyUser(selectedRow.cedula);
    });
}

function destroyUser(cedula) {
    $.ajax({
        url: `${API_BASE}?cedula=${encodeURIComponent(cedula)}`,
        type: 'DELETE',
        success: function() {
            loadData();
            showToast('User deleted successfully.', 'success');
        },
        error: function(xhr) {
            showToast('Failed to delete user: ' + xhr.responseText, 'danger');
        }
    });
}
