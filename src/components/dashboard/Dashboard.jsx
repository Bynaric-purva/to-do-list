import { useState } from "react";

function Dashboard() {
  const accountCreatedDate = "2026-02-01";
  const todayStr = new Date().toISOString().split("T")[0];

  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [budgetMessage, setBudgetMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseAmounts, setExpenseAmounts] = useState({
    Food: "",
    Rent: "",
    Bills: "",
    Travel: "",
    Other: "",
  });
  const [date, setDate] = useState("");
  const [expenseMessage, setExpenseMessage] = useState("");

  // ===============================
  // Budget Validation
  // ===============================
  const handleBudgetChange = (e) => {
    const value = e.target.value;
    setMonthlyBudget(value);
    const num = Number(value);

    if (!value) setBudgetMessage("");
    else if (isNaN(num) || num < 1000 || num > 100000)
      setBudgetMessage("Budget must be between ₹1,000 and ₹100,000.");
    else setBudgetMessage("Budget set successfully.");
  };

  const budgetValid =
    monthlyBudget &&
    !isNaN(Number(monthlyBudget)) &&
    Number(monthlyBudget) >= 1000 &&
    Number(monthlyBudget) <= 100000;

  // ===============================
  // Add / Merge Expenses
  // ===============================
  const handleAddExpenses = () => {
    if (!budgetValid) {
      setExpenseMessage("Please set a valid monthly budget first.");
      return;
    }

    if (!date) {
      setExpenseMessage("Please select a date.");
      return;
    }

    if (date < accountCreatedDate || date > todayStr) {
      setExpenseMessage(
        "Expense date must be between account creation and today."
      );
      return;
    }

    const updatedExpenses = [...expenses];

    for (const [category, amt] of Object.entries(expenseAmounts)) {
      if (!amt) continue;

      const numAmt = Number(amt);

      if (isNaN(numAmt) || numAmt <= 0) {
        setExpenseMessage(`${category} must be greater than 0.`);
        return;
      }

      if (numAmt > 100000) {
        setExpenseMessage(`${category} cannot exceed ₹100,000.`);
        return;
      }

      const existingIndex = updatedExpenses.findIndex(
        (e) => e.date === date && e.category === category
      );

      if (existingIndex !== -1) {
        updatedExpenses[existingIndex].amount += numAmt;
      } else {
        updatedExpenses.push({
          category,
          amount: numAmt,
          date,
        });
      }
    }

    setExpenses(updatedExpenses);
    setExpenseAmounts({
      Food: "",
      Rent: "",
      Bills: "",
      Travel: "",
      Other: "",
    });
    setDate("");
    setExpenseMessage("");
  };

  // ===============================
  // Update Single Expense
  // ===============================
  const handleUpdate = (index) => {
    const exp = expenses[index];

    setDate(exp.date);
    setExpenseAmounts({
      Food: "",
      Rent: "",
      Bills: "",
      Travel: "",
      Other: "",
      [exp.category]: exp.amount,
    });

    // Remove old entry (will re-add after editing)
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  // ===============================
  // Delete Expense
  // ===============================
  const handleDelete = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  // ===============================
  // Calculations (UNCHANGED UI LOGIC)
  // ===============================
  const monthlySpent = expenses.reduce(
    (total, e) => total + e.amount,
    0
  );

  const remaining = monthlyBudget
    ? Number(monthlyBudget) - monthlySpent
    : 0;

  const budgetUsedPercent = monthlyBudget
    ? Math.min(
        Math.round((monthlySpent / Number(monthlyBudget)) * 100),
        100
      )
    : 0;

  const progressColor =
    budgetUsedPercent <= 50
      ? "bg-green-500"
      : budgetUsedPercent <= 80
      ? "bg-orange-500"
      : "bg-red-500";

  // ===============================
  // Group By Date
  // ===============================
  const groupedExpenses = expenses.reduce((acc, exp, idx) => {
    if (!acc[exp.date]) acc[exp.date] = [];
    acc[exp.date].push({ ...exp, idx });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-pink-100 to-yellow-100 p-6">

      {/* Monthly Budget */}
      <div className="bg-white p-5 rounded-2xl shadow-lg mb-6 border-l-8 border-indigo-400">
        <p className="text-slate-600 font-semibold">Monthly Budget</p>
        <input
          type="number"
          value={monthlyBudget}
          onChange={handleBudgetChange}
          placeholder="Enter monthly budget (₹)"
          className="mt-2 w-full border p-2 rounded-lg"
        />
        {budgetMessage && (
          <p
            className={`mt-2 text-sm ${
              budgetValid ? "text-green-600" : "text-red-600"
            }`}
          >
            {budgetMessage}
          </p>
        )}
      </div>

      {/* Budget Summary Cards (UNCHANGED) */}
      {budgetValid && (
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-lg border-l-8 border-green-400">
            <p className="text-slate-600 font-semibold">Remaining Budget</p>
            <p
              className={`text-2xl font-bold mt-2 ${
                remaining < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ₹{remaining}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border-l-8 border-blue-400">
            <p className="text-slate-600 font-semibold mb-2">Budget Used</p>
            <p className="text-lg font-semibold mb-2">
              {budgetUsedPercent}%
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border-l-8 border-pink-400">
            <p className="text-slate-600 font-semibold mb-2">
              Usage Progress
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${progressColor}`}
                style={{ width: `${budgetUsedPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-l-8 border-indigo-400">
        <h2 className="text-xl font-semibold mb-4">
          Add / Update Expenses
        </h2>

        <div className="grid md:grid-cols-6 gap-4">
          <input
            type="date"
            value={date}
            min={accountCreatedDate}
            max={todayStr}
            onChange={(e) => setDate(e.target.value)}
            disabled={!budgetValid}
            className="border p-3 rounded-lg"
          />

          {Object.keys(expenseAmounts).map((cat) => (
            <input
              key={cat}
              type="number"
              placeholder={`${cat} (₹)`}
              value={expenseAmounts[cat]}
              onChange={(e) =>
                setExpenseAmounts({
                  ...expenseAmounts,
                  [cat]: e.target.value,
                })
              }
              disabled={!budgetValid}
              className="border p-3 rounded-lg"
            />
          ))}

          <button
            onClick={handleAddExpenses}
            disabled={!budgetValid}
            className="bg-indigo-600 text-white rounded-lg px-4 hover:bg-indigo-700"
          >
            Add / Merge
          </button>
        </div>

        {expenseMessage && (
          <p className="text-red-500 text-sm mt-2">
            {expenseMessage}
          </p>
        )}
      </div>

      {/* Expenses List with Update & Delete */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(groupedExpenses)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((expDate) => {
            const dayExpenses = groupedExpenses[expDate];
            const dailyTotal = dayExpenses.reduce(
              (t, e) => t + e.amount,
              0
            );

            return (
              <div
                key={expDate}
                className="bg-white p-5 rounded-2xl shadow-lg"
              >
                <div className="flex justify-between mb-3 font-semibold">
                  <span>{expDate}</span>
                  <span>₹{dailyTotal}</span>
                </div>

                {dayExpenses.map((e) => (
                  <div
                    key={e.idx}
                    className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded-lg"
                  >
                    <div>
                      <p className="text-sm">{e.category}</p>
                      <p className="font-bold">₹{e.amount}</p>
                    </div>

                    <div className="space-x-2">
                      <button
                        onClick={() => handleUpdate(e.idx)}
                        className="text-blue-600 text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(e.idx)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
