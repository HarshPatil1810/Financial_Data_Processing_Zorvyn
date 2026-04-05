import React, { useState } from "react";
import { Nav, Offcanvas, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const roleId = parseInt(localStorage.getItem("roleId")); // get roleId from localStorage
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Toggle button for small screens */}
      <Button
        variant="dark"
        className="d-lg-none m-2"
        onClick={handleShow}
      >
        ☰ Menu
      </Button>

      {/* Sidebar for large screens */}
      <div
        className="d-none d-lg-flex flex-column vh-100 bg-dark text-white position-fixed start-0 p-3"
        style={{ width: "220px" }}
      >
        <h4 className="text-center mb-4">Menu</h4>
        <Nav defaultActiveKey="/dashboard" className="flex-column">
          <Nav.Link className="text-white" onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
          <Nav.Link className="text-white" onClick={() => navigate("/view-transaction")}>View Data</Nav.Link>
          {roleId === 1 && <Nav.Link className="text-white" onClick={() => navigate("/add-transaction")}>Add Transaction</Nav.Link>}
          {roleId === 1 && <Nav.Link className="text-white" onClick={() => navigate("/usermanagement")}>User Management</Nav.Link>}
        </Nav>
      </div>

      {/* Offcanvas for small screens */}
      <Offcanvas show={show} onHide={handleClose} backdrop="true">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => { navigate("/dashboard"); handleClose(); }}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => { navigate("/view-transaction"); handleClose(); }}>View Data</Nav.Link>
            {roleId === 1 && <Nav.Link onClick={() => { navigate("/add-transaction"); handleClose(); }}>Add Transaction</Nav.Link>}
            {roleId === 1 && <Nav.Link onClick={() => { navigate("/usermanagement"); handleClose(); }}>User Management</Nav.Link>}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
