import { useState } from "react";
import { Link } from "react-router-dom";

interface Expense {
	id: string;
	description: string;
	amount: number;
	paidBy: string;
	splitAmong: string[];
}

export default function GroupSpend() {
	const [people, setPeople] = useState<string[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [newPerson, setNewPerson] = useState("");
	const [newExpense, setNewExpense] = useState({
		description: "",
		amount: "",
		paidBy: "",
	});

	const addPerson = () => {
		if (newPerson.trim()) {
			setPeople([...people, newPerson.trim()]);
			setNewPerson("");
		}
	};
	const addExpense = () => {
		if (newExpense.description && newExpense.amount && newExpense.paidBy) {
			setExpenses([
				...expenses,
				{
					id: `e-${Date.now()}`,
					description: newExpense.description,
					amount: parseFloat(newExpense.amount),
					paidBy: newExpense.paidBy,
					splitAmong: people,
				},
			]);
			setNewExpense({ ...newExpense, description: "", amount: "" });
		}
	};

	const balances: Record<string, number> = {};
	people.forEach((p) => {
		balances[p] = 0;
	});
	expenses.forEach((e) => {
		balances[e.paidBy] += e.amount;
		e.splitAmong.forEach((p) => {
			if (balances[p] !== undefined)
				balances[p] -= e.amount / e.splitAmong.length;
		});
	});

	const owed: { from: string; to: string; amount: number }[] = [];
	const debtors = Object.entries(balances)
		.filter(([_, v]) => v < -0.01)
		.sort((a, b) => a[1] - b[1]);
	const creditors = Object.entries(balances)
		.filter(([_, v]) => v > 0.01)
		.sort((a, b) => b[1] - a[1]);
	let i = 0,
		j = 0;
	while (i < debtors.length && j < creditors.length) {
		const [debtor, debt] = debtors[i];
		const [creditor, credit] = creditors[j];
		const amount = Math.min(-debt, credit);
		if (amount > 0.01) owed.push({ from: debtor, to: creditor, amount });
		debtors[i] = [debtor, debt + amount];
		creditors[j] = [creditor, credit - amount];
		if (Math.abs(debtors[i][1]) < 0.01) i++;
		if (Math.abs(creditors[j][1]) < 0.01) j++;
	}

	const exportSummary = () => {
		let text = "Group Expense Summary\n\n";
		expenses.forEach(
			(e) =>
				(text += `${e.paidBy} paid $${e.amount.toFixed(2)} for ${e.description}\n`),
		);
		text += "\nSettlements:\n";
		owed.forEach(
			(o) => (text += `${o.from} owes ${o.to} $${o.amount.toFixed(2)}\n`),
		);
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Group Spend</h1>
				<p>Track group expenses</p>
			</div>
			<div className="section">
				<h3>People</h3>
				<div className="input-row">
					<input
						value={newPerson}
						onChange={(e) => setNewPerson(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && addPerson()}
						placeholder="Add person..."
					/>
					<button onClick={addPerson}>+</button>
				</div>
				<div className="tags">
					{people.map((p) => (
						<span key={p} className="tag">
							{p}
						</span>
					))}
				</div>
			</div>
			{people.length > 0 && (
				<div className="section">
					<h3>Add Expense</h3>
					<input
						value={newExpense.description}
						onChange={(e) =>
							setNewExpense({ ...newExpense, description: e.target.value })
						}
						placeholder="What for?"
					/>
					<input
						value={newExpense.amount}
						onChange={(e) =>
							setNewExpense({ ...newExpense, amount: e.target.value })
						}
						placeholder="Amount"
						type="number"
					/>
					<select
						value={newExpense.paidBy}
						onChange={(e) =>
							setNewExpense({ ...newExpense, paidBy: e.target.value })
						}
					>
						<option value="">Who paid?</option>
						{people.map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</select>
					<button onClick={addExpense}>Add Expense</button>
				</div>
			)}
			{expenses.length > 0 && (
				<>
					<div className="section">
						<h3>Expenses</h3>
						{expenses.map((e) => (
							<div key={e.id} className="expense-item">
								<span>{e.description}</span>
								<span>
									${e.amount.toFixed(2)} by {e.paidBy}
								</span>
							</div>
						))}
					</div>
					<div className="section">
						<h3>Who Owes Who</h3>
						{owed.map((o, i) => (
							<div key={i} className="settlement">
								{o.from} → {o.to}: <strong>${o.amount.toFixed(2)}</strong>
							</div>
						))}
					</div>
					<button className="export-btn" onClick={exportSummary}>
						Export Summary
					</button>
				</>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        .section { background: rgba(255,255,255,0.08); border-radius: 1rem; padding: 1rem; margin-bottom: 1rem; }
        .section h3 { margin: 0 0 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.6); text-transform: uppercase; }
        .input-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
        .input-row input { flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.1); border: none; border-radius: 0.4rem; color: white; }
        .input-row button { padding: 0.6rem 1rem; background: #4facfe; border: none; border-radius: 0.4rem; color: white; font-weight: 600; cursor: pointer; }
        .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tag { padding: 0.3rem 0.7rem; background: rgba(255,255,255,0.15); border-radius: 1rem; font-size: 0.85rem; }
        .section input, .section select { width: 100%; padding: 0.6rem; background: rgba(255,255,255,0.1); border: none; border-radius: 0.4rem; color: white; margin-bottom: 0.5rem; box-sizing: border-box; }
        .section button { width: 100%; padding: 0.75rem; background: #4facfe; border: none; border-radius: 0.5rem; color: white; font-weight: 600; cursor: pointer; }
        .expense-item { display: flex; justify-content: space-between; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.4rem; margin-bottom: 0.3rem; font-size: 0.9rem; }
        .settlement { padding: 0.5rem; background: rgba(79,172,254,0.2); border-radius: 0.4rem; margin-bottom: 0.3rem; }
        .export-btn { width: 100%; padding: 0.75rem; background: white; border: none; border-radius: 0.5rem; color: #1e3c72; font-weight: 600; cursor: pointer; }
      `}</style>
		</div>
	);
}
