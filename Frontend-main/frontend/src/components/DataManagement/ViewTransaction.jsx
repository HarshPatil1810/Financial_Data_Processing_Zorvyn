import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Card, Row, Col, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ViewTransaction = () => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [sortField, setSortField] = useState("RecordDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Get roleId from localStorage
  const roleId = parseInt(localStorage.getItem("roleId")) || 3;

  const fetchRecords = async (page = 1) => {
    try {
      const res = await axios.get(`https://localhost:7046/api/FinancialRecord/get-all`, {
        params: {
          page,
          pageSize: recordsPerPage,
          type: typeFilter,
          category: categoryFilter,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          sortField,
          sortOrder
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecords(res.data.records);
      setTotalRecords(res.data.totalRecords);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch records");
    }
  };

  useEffect(() => {
    fetchRecords(currentPage);
  }, [currentPage, typeFilter, categoryFilter, dateFrom, dateTo, sortField, sortOrder]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleFilterReset = () => {
    setTypeFilter("");
    setCategoryFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const handleEdit = (record) => {
    setEditRecord({ ...record });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditRecord(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://localhost:7046/api/FinancialRecord/update/${editRecord.recordId}`,
        editRecord,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Record updated successfully");
      handleCloseModal();
      fetchRecords(currentPage);
    } catch (err) {
      console.error(err);
      alert("Failed to update record");
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`https://localhost:7046/api/FinancialRecord/delete/${recordId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchRecords(currentPage);
      alert("Record deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete record");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="fw-bold mb-4">Financial Dashboard</h3>

          {/* Filters */}
          <Row className="mb-3">
            <Col xs={12} sm={6} md={2} className="mb-2">
              <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Form.Select>
            </Col>
            <Col xs={12} sm={6} md={3} className="mb-2">
              <Form.Control
                type="text"
                placeholder="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </Col>
            <Col xs={6} sm={3} md={2} className="mb-2">
              <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </Col>
            <Col xs={6} sm={3} md={2} className="mb-2">
              <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </Col>
            <Col xs={12} sm={12} md={3} className="mb-2">
              <Button variant="secondary" className="w-100" onClick={handleFilterReset}>
                Reset Filters
              </Button>
            </Col>
          </Row>

          {/* Table */}
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th onClick={() => handleSort("Amount")} style={{ cursor: "pointer" }}>
                    Amount {sortField === "Amount" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th onClick={() => handleSort("Type")} style={{ cursor: "pointer" }}>
                    Type {sortField === "Type" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>Category</th>
                  <th onClick={() => handleSort("RecordDate")} style={{ cursor: "pointer" }}>
                    Date {sortField === "RecordDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>Notes</th>
                  {roleId === 1 && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((r, index) => (
                    <tr key={r.recordId}>
                      <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                      <td>{r.amount}</td>
                      <td>{r.type}</td>
                      <td>{r.category}</td>
                      <td>{new Date(r.recordDate).toLocaleDateString()}</td>
                      <td>{r.notes}</td>
                      {roleId === 1 && (
                        <td className="d-flex flex-wrap gap-1">
                          <Button variant="outline-primary" size="sm" className="w-100 w-sm-auto" onClick={() => handleEdit(r)}>
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" className="w-100 w-sm-auto" onClick={() => handleDelete(r.recordId)}>
                            <FaTrash />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={roleId === 1 ? "7" : "6"} className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination className="justify-content-center mt-3 flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editRecord && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editRecord.amount}
                  onChange={(e) => setEditRecord({ ...editRecord, amount: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={editRecord.type}
                  onChange={(e) => setEditRecord({ ...editRecord, type: e.target.value })}
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.category}
                  onChange={(e) => setEditRecord({ ...editRecord, category: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={new Date(editRecord.recordDate).toISOString().slice(0, 10)}
                  onChange={(e) => setEditRecord({ ...editRecord, recordDate: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.notes}
                  onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewTransaction;
