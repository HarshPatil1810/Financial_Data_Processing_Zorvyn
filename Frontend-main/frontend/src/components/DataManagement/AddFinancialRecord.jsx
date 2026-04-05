import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const AddFinancialRecord = () => {
  const [form, setForm] = useState({
    Amount: "",
    Type: "",
    Category: "",
    RecordDate: "",
    Notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: check required fields
    if (!form.Amount || !form.Type || !form.Category || !form.RecordDate) {
      toast.error("All fields except Notes are required!", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    const recordToSend = {
      ...form,
      Amount: Number(form.Amount),
      CreatedBy: localStorage.getItem("username") || "Unknown"
    };

    try {
      await axios.post(
        "https://localhost:7046/api/FinancialRecord/create",
        recordToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Record added successfully!", {
        position: "top-right",
        autoClose: 3000
      });

      // Reset form
      setForm({ Amount: "", Type: "", Category: "", RecordDate: "", Notes: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add record", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <Card className="shadow-sm p-4" style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h4 className="mb-4">Add Financial Record</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="Amount"
            placeholder="Enter amount"
            value={form.Amount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select name="Type" value={form.Type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="Category"
            placeholder="Enter category"
            value={form.Category}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="RecordDate"
            value={form.RecordDate}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Notes / Description</Form.Label>
          <Form.Control
            as="textarea"
            name="Notes"
            placeholder="Enter any notes"
            value={form.Notes}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        <Button type="submit" variant="success">
          Add Record
        </Button>
      </Form>
    </Card>
  );
};

export default AddFinancialRecord;
