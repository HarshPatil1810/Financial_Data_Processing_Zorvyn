import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Table } from "react-bootstrap";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("https://localhost:7046/api/FinancialRecord/get-all", {
        params: { page: 1, pageSize: 1000 },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecords(res.data.records);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  // --- Calculations ---
  const totalIncome = records.filter(r => r.type === "Income").reduce((a,b) => a + b.amount, 0);
  const totalExpense = records.filter(r => r.type === "Expense").reduce((a,b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const categoryMap = {};
  records.forEach(r => {
    if (!categoryMap[r.category]) categoryMap[r.category] = 0;
    categoryMap[r.category] += r.amount;
  });
  const categoryData = Object.keys(categoryMap).map(key => ({ category: key, amount: categoryMap[key] }));

  const recentActivity = [...records].sort((a,b) => new Date(b.recordDate) - new Date(a.recordDate)).slice(0,5);

  const monthMap = {};
  records.forEach(r => {
    const month = new Date(r.recordDate).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthMap[month]) monthMap[month] = 0;
    monthMap[month] += r.type === "Income" ? r.amount : -r.amount;
  });
  const monthlyTrend = Object.keys(monthMap).map(key => ({ month: key, total: monthMap[key] }));

  const COLORS = ["#4CAF50", "#F44336"];
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense }
  ];

  return (
    <div className="container-fluid mt-4">
      <h3 className="mb-4">Financial Dashboard</h3>

      <Row className="mb-4">
        <Col xs={12} md={4} className="mb-3">
          <Card className="p-3 text-center">
            <h5>Total Income</h5>
            <h3 className="text-success">₹ {totalIncome.toLocaleString()}</h3>
          </Card>
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <Card className="p-3 text-center">
            <h5>Total Expense</h5>
            <h3 className="text-danger">₹ {totalExpense.toLocaleString()}</h3>
          </Card>
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <Card className="p-3 text-center">
            <h5>Net Balance</h5>
            <h3 style={{ color: netBalance >= 0 ? 'green' : 'red' }}>₹ {netBalance.toLocaleString()}</h3>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col xs={12} md={6} className="mb-3">
          <Card className="p-3">
            <h5>Total Income vs Expense</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={12} md={6} className="mb-3">
          <Card className="p-3">
            <h5>Category-wise Totals</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Monthly Trend Line */}
      <Row className="mb-4">
        <Col xs={12} className="mb-3">
          <Card className="p-3">
            <h5>Monthly Trend</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Row>
        <Col xs={12} className="mb-3">
          <Card className="p-3">
            <h5>Recent Activity</h5>
            <Table hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((r, i) => (
                  <tr key={r.RecordId}>
                    <td>{i+1}</td>
                    <td>₹ {r.amount.toLocaleString()}</td>
                    <td>{r.type}</td>
                    <td>{r.category}</td>
                    <td>{new Date(r.recordDate).toLocaleDateString()}</td>
                    <td>{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
