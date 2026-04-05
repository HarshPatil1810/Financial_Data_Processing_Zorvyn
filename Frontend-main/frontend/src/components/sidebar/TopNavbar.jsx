import React from "react";
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const TopNavbar = () => {
    const navigate = useNavigate();

    // Get user info from localStorage
    const username = localStorage.getItem("username") || "User";
    const roleId = parseInt(localStorage.getItem("roleId")) || 3;

    // Map roleId to role name
    const getRoleName = (id) => {
        if (id === 1) return "Admin";
        if (id === 2) return "Analyst";
        return "Viewer";
    };

    const handleLogout = () => {
        localStorage.clear(); // clear token and user info
        navigate("/");         // redirect to login page
    };

    const handleProfile = () => {
        navigate("/profile"); // redirect to profile page
    };

    const handleChangePassword = () => {
        navigate("/change-password"); // redirect to change password page
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
            <Container fluid>
                <Navbar.Brand>Zorvyn</Navbar.Brand>

                {/* Hamburger toggle for mobile */}
                <Navbar.Toggle aria-controls="top-navbar-nav" />

                {/* Collapse menu */}
                <Navbar.Collapse id="top-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center">
                        <span className="text-white me-3 mb-2 mb-lg-0">
                            Welcome {username} ({getRoleName(roleId)})
                        </span>

                        {/* Profile Dropdown */}
                       

                        <Button 
                            variant="outline-light" 
                            size="sm" 
                            onClick={handleLogout}
                            className="mb-2 mb-lg-0"
                        >
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
