package controller;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import model.User;
import dao.UserDaoi;  // Importamos el UserDao para interactuar con la base de datos

@WebServlet(name = "UserController", urlPatterns = {"/UserController"})
public class UserController extends HttpServlet {

    private final Gson gson = new Gson();
    private final UserDaoi userDao = new UserDaoi();  // Instanciamos el UserDao

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String cedula = request.getParameter("cedula");
        if (cedula != null && !cedula.isEmpty()) {
            User user = userDao.getUserByCedula(cedula);  // Usamos el UserDao directamente
            if (user != null) {
                String json = gson.toJson(user);
                response.getWriter().write(json);
            } else {
                response.getWriter().write("[]");
            }
        } else {
            List<User> users = userDao.getAllUsers();  // Usamos el UserDao directamente
            String json = gson.toJson(users);
            response.getWriter().write(json);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        BufferedReader reader = request.getReader();
        User user = gson.fromJson(reader, User.class);
        boolean create = userDao.saveUser(user);  // Usamos el UserDao directamente
        if (create) {
            sendResponse(response, HttpServletResponse.SC_CREATED, "Usuario Creado con exito");
        } else {
            sendResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Error al crear el usuario");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        BufferedReader reader = request.getReader();
        User user = gson.fromJson(reader, User.class);

        boolean updated = userDao.updateUser(user);  // Usamos el UserDao directamente
        if (updated) {
            sendResponse(response, HttpServletResponse.SC_OK, "Usuario actualizado");
        } else {
            sendResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Error al actualizar usuario");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String cedula = request.getParameter("cedula");

        if (cedula == null || cedula.isEmpty()) {
            sendResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Cédula requerida para eliminar usuario");
            return;
        }
        boolean deleted = userDao.deleteUser(cedula);  // Usamos el UserDao directamente

        if (deleted) {
            sendResponse(response, HttpServletResponse.SC_OK, "Usuario eliminado correctamente");
        } else {
            sendResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Error al eliminar usuario");
        }
    }

    private void sendResponse(HttpServletResponse response, int status, String message)
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(status);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }

    @Override
    public String getServletInfo() {
        return "UserController - Controller for User management";
    }
}
