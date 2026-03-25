import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Login from "./Login";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // 🔐 LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 💰 EXPENSE STATES
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  // 📊 TOTAL
  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  // 📡 FETCH DATA
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:3002/api/expenses");
    setExpenses(res.data);
  };

  // ➕ ADD
  const addExpense = async () => {
    if (!title || !amount || !category) {
      alert("Please fill all fields");
      return;
    }

    await axios.post("http://localhost:3002/api/expenses", {
      title,
      amount,
      category,
    });

    clearForm();
    fetchExpenses();
  };

  // ✏️ UPDATE
  const updateExpense = async () => {
    await axios.put(`http://localhost:3002/api/expenses/${editingId}`, {
      title,
      amount,
      category,
    });

    setEditingId(null);
    clearForm();
    fetchExpenses();
  };

  // ❌ DELETE
  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:3002/api/expenses/${id}`);
    fetchExpenses();
  };

  // 🧹 CLEAR
  const clearForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
  };

  // 📊 CHART DATA
  const categoryData = {};

  expenses.forEach((exp) => {
    if (!categoryData[exp.category]) {
      categoryData[exp.category] = 0;
    }
    categoryData[exp.category] += Number(exp.amount);
  });

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryData),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#E91E63",
          "#9C27B0",
        ],
        borderRadius: 8,
      },
    ],
  };

  // 🔐 LOGIN CHECK (ONLY HERE)
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  // 🎨 MAIN UI
  return (
    <div className="container">
      <h1 className="title">SmartSpend 💸</h1>

      <h2 className="total">Total: ₹{totalAmount}</h2>

      <div style={{ marginBottom: "30px" }}>
        <Bar data={chartData} />
      </div>

      {/* FORM */}
      <div className="form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={editingId ? updateExpense : addExpense}
          className={`add-btn ${editingId ? "update-btn" : ""}`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      {expenses.map((exp) => (
        <div key={exp._id} className="card">
          <div>
            <b>{exp.title}</b> - ₹{exp.amount} ({exp.category})
          </div>

          <div>
            <button
              className="edit-btn"
              onClick={() => {
                setEditingId(exp._id);
                setTitle(exp.title);
                setAmount(exp.amount);
                setCategory(exp.category);
              }}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteExpense(exp._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;