/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JOptionPane;
import model.User;
import util.conexion;

/**
 *
 * @author david
 */
public class UserDaoi {

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        String sql = "Select * from estudiantes";
        try (Connection conn = conexion.getConexion(); PreparedStatement ps = conn.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                User u = new User();
                u.setCedula(rs.getString("cedula"));
                u.setNombre(rs.getString("nombre"));
                u.setApellido(rs.getString("apellido"));
                u.setDireccion(rs.getString("direccion"));
                u.setTelefono(rs.getString("telefono"));
                users.add(u);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e);
        }
        return users;
    }

    public boolean saveUser(User user) {
        String sql = "Insert into estudiantes(cedula, nombre, apellido, direccion,telefono) "
                + "VALUES(?,?,?,?,?)";
        try (Connection con = conexion.getConexion();) {
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, user.getCedula());
            ps.setString(2, user.getNombre());
            ps.setString(3, user.getApellido());
            ps.setString(4, user.getDireccion());
            ps.setString(5, user.getTelefono());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e);
            return false;
        }
    }

    public boolean updateUser(User user) {
        String sql = "UPDATE estudiantes SET nombre = ?, apellido = ?, direccion = ?, telefono = ? WHERE cedula = ?";
        try (Connection con = conexion.getConexion()) {
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, user.getNombre());
            ps.setString(2, user.getApellido());
            ps.setString(3, user.getDireccion());
            ps.setString(4, user.getTelefono());
            ps.setString(5, user.getCedula());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e);
            return false;
        }
    }
    public boolean deleteUser(String cedula) {
    String sql = "DELETE FROM estudiantes WHERE cedula = ?";
    try (Connection con = conexion.getConexion()) {
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, cedula);
        return ps.executeUpdate() > 0;
    } catch (Exception e) {
        JOptionPane.showMessageDialog(null, e);
        return false;
    }
}
public User getUserByCedula(String cedula) {
    String sql = "SELECT * FROM estudiantes WHERE cedula = ?";
    try (Connection con = conexion.getConexion();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, cedula);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            User u = new User();
            u.setCedula(rs.getString("cedula"));
            u.setNombre(rs.getString("nombre"));
            u.setApellido(rs.getString("apellido"));
            u.setDireccion(rs.getString("direccion"));
            u.setTelefono(rs.getString("telefono"));
            return u;
        }
    } catch (Exception e) {
        JOptionPane.showMessageDialog(null, e);
    }
    return null;
}
}
