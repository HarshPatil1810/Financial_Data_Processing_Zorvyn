import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Badge, Card, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [form, setForm] = useState({
    Username: "",
    FullName: "",
    Email: "",
    PasswordHash: "",
    RoleId: ""
  });

  const handleEdit = (user) => {
    setForm({
      Username: user.Username,
      FullName: user.FullName,
      Email: user.Email,
      PasswordHash: "", 
      RoleId: user.RoleId
    });
    setEditUserId(user.UserId);
    setShow(true);
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:7046/api/User/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.post(`https://localhost:7046/api/User/delete/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed!");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddUser = async () => {
    if (!form.Username || !form.FullName || !form.Email || !form.RoleId) {
      toast.error("All fields are required!");
      return;
    }
    if (!editUserId && !form.PasswordHash) {
      toast.error("Password is required!");
      return;
    }

    const userToSend = { ...form, CreatedBy: localStorage.getItem("username") };
    if (!userToSend.PasswordHash) delete userToSend.PasswordHash;

    try {
      if (editUserId) {
        await axios.put(`https://localhost:7046/api/User/update-user/${editUserId}`, userToSend, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("User updated successfully!");
      } else {
        await axios.post("https://localhost:7046/api/User/create-user", userToSend, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("User added successfully!");
      }
      setShow(false);
      setForm({ Username: "", FullName: "", Email: "", PasswordHash: "", RoleId: "" });
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.log(err);
      toast.error("Operation failed!");
    }
  };

  const getRoleBadge = (roleId) => {
    if (roleId == 1) return <Badge bg="danger">Admin</Badge>;
    if (roleId == 2) return <Badge bg="warning">Analyst</Badge>;
    return <Badge bg="secondary">Viewer</Badge>;
  };

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={6}>
          <h3 className="fw-bold">User Management</h3>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
          <Button variant="primary" onClick={() => setShow(true)}>
            + Add User
          </Button>
        </Col>
      </Row>

      {/* Card Container */}
      <Card className="shadow-sm">
        <Card.Body className="p-2 p-md-3">

          {/* Table */}
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.UserId}>
                      <td>{u.Username}</td>
                      <td>{u.FullName}</td>
                      <td>{u.Email}</td>
                      <td>{getRoleBadge(u.RoleId)}</td>
                      <td className="text-center">
                        <Button variant="outline-primary" size="sm" className="me-2 mb-1" onClick={() => handleEdit(u)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" className="mb-1" onClick={() => handleDelete(u.UserId)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No users found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editUserId ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="Username" value={form.Username} placeholder="Enter username" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="FullName" value={form.FullName} placeholder="Enter full name" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="Email" value={form.Email} placeholder="Enter email" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="PasswordHash" placeholder={editUserId ? "Leave blank to keep existing password" : "Enter password"} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="RoleId" value={form.RoleId} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="1">Admin</option>
                <option value="2">Analyst</option>
                <option value="3">Viewer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="success" onClick={handleAddUser}>{editUserId ? "Update User" : "Save User"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
