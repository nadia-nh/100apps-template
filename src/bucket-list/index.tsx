import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Goal {
	id: string;
	title: string;
	status: "dream" | "in_progress" | "completed";
	category: string;
	location?: string;
	cost?: number;
	notes?: string;
}

const categories = [
	"Travel",
	"Adventure",
	"Career",
	"Learning",
	"Personal",
	"Creative",
	"Health",
	"Social",
	"Other",
];

export default function BucketList() {
	const [goals, setGoals] = useState<Goal[]>(() => {
		const saved = localStorage.getItem("bucket-list");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [filter, setFilter] = useState<
		"all" | "dream" | "in_progress" | "completed"
	>("all");

	const [newGoal, setNewGoal] = useState<Partial<Goal>>({
		title: "",
		status: "dream",
		category: "Adventure",
	});

	useEffect(() => {
		localStorage.setItem("bucket-list", JSON.stringify(goals));
	}, [goals]);

	const addGoal = () => {
		if (!newGoal.title?.trim()) return;
		const goal: Goal = {
			id: `goal-${Date.now()}`,
			title: newGoal.title,
			status: newGoal.status || "dream",
			category: newGoal.category || "Other",
			location: newGoal.location,
			cost: newGoal.cost,
			notes: newGoal.notes,
		};
		setGoals([...goals, goal]);
		setNewGoal({ title: "", status: "dream", category: "Adventure" });
		setShowAdd(false);
	};

	const updateGoalStatus = (id: string, status: Goal["status"]) => {
		setGoals(goals.map((g) => (g.id === id ? { ...g, status } : g)));
	};

	const deleteGoal = (id: string) => {
		setGoals(goals.filter((g) => g.id !== id));
		setEditingGoal(null);
	};

	const filteredGoals =
		filter === "all" ? goals : goals.filter((g) => g.status === filter);

	const dreamCount = goals.filter((g) => g.status === "dream").length;
	const progressCount = goals.filter((g) => g.status === "in_progress").length;
	const completedCount = goals.filter((g) => g.status === "completed").length;
	const completionRate =
		goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

	const statusColors = {
		dream: "#f39c12",
		in_progress: "#3498db",
		completed: "#2ecc71",
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Bucket List</h1>
				<p>Track your life goals</p>
			</div>

			<div className="stats-row">
				<div className="stat-card">
					<span className="stat-value" style={{ color: "#f39c12" }}>
						{dreamCount}
					</span>
					<span className="stat-label">Dreams</span>
				</div>
				<div className="stat-card">
					<span className="stat-value" style={{ color: "#3498db" }}>
						{progressCount}
					</span>
					<span className="stat-label">In Progress</span>
				</div>
				<div className="stat-card">
					<span className="stat-value" style={{ color: "#2ecc71" }}>
						{completedCount}
					</span>
					<span className="stat-label">Completed</span>
				</div>
			</div>

			<div className="progress-banner">
				<div className="progress-bar">
					<div
						className="progress-fill"
						style={{ width: `${completionRate}%` }}
					></div>
				</div>
				<span className="progress-text">{completionRate}% complete</span>
			</div>

			<div className="filter-tabs">
				{(["all", "dream", "in_progress", "completed"] as const).map((f) => (
					<button
						key={f}
						className={`filter-tab ${filter === f ? "active" : ""}`}
						onClick={() => setFilter(f)}
					>
						{f === "all"
							? "All"
							: f === "in_progress"
								? "In Progress"
								: f.charAt(0).toUpperCase() + f.slice(1)}
					</button>
				))}
			</div>

			<button className="add-btn" onClick={() => setShowAdd(true)}>
				+ Add Goal
			</button>

			<div className="goals-list">
				{filteredGoals.length === 0 ? (
					<div className="empty-state">
						<span className="empty-icon">🎯</span>
						<p>
							{filter === "all"
								? "No goals yet"
								: `No ${filter.replace("_", " ")} goals`}
						</p>
						<p className="empty-hint">Add your first goal to get started</p>
					</div>
				) : (
					filteredGoals.map((goal) => (
						<div
							key={goal.id}
							className="goal-card"
							onClick={() => setEditingGoal(goal)}
						>
							<div className="goal-header">
								<span
									className="goal-category"
									style={{ background: statusColors[goal.status] }}
								>
									{goal.category}
								</span>
								<select
									className="status-select"
									value={goal.status}
									onChange={(e) =>
										updateGoalStatus(goal.id, e.target.value as Goal["status"])
									}
									onClick={(e) => e.stopPropagation()}
									style={{ color: statusColors[goal.status] }}
								>
									<option value="dream">Dream</option>
									<option value="in_progress">In Progress</option>
									<option value="completed">Completed</option>
								</select>
							</div>
							<h3 className="goal-title">{goal.title}</h3>
							<div className="goal-meta">
								{goal.location && (
									<span className="meta-item">📍 {goal.location}</span>
								)}
								{goal.cost && (
									<span className="meta-item">💰 ${goal.cost}</span>
								)}
							</div>
							{goal.notes && <p className="goal-notes">{goal.notes}</p>}
						</div>
					))
				)}
			</div>

			{showAdd && (
				<div className="modal-overlay" onClick={() => setShowAdd(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Add New Goal</h3>
						<input
							type="text"
							placeholder="What do you want to achieve?"
							value={newGoal.title}
							onChange={(e) =>
								setNewGoal({ ...newGoal, title: e.target.value })
							}
							autoFocus
						/>
						<select
							value={newGoal.category}
							onChange={(e) =>
								setNewGoal({ ...newGoal, category: e.target.value })
							}
						>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<select
							value={newGoal.status}
							onChange={(e) =>
								setNewGoal({
									...newGoal,
									status: e.target.value as Goal["status"],
								})
							}
						>
							<option value="dream">Dream</option>
							<option value="in_progress">In Progress</option>
							<option value="completed">Completed</option>
						</select>
						<input
							type="text"
							placeholder="Location (optional)"
							value={newGoal.location || ""}
							onChange={(e) =>
								setNewGoal({ ...newGoal, location: e.target.value })
							}
						/>
						<input
							type="number"
							placeholder="Estimated cost (optional)"
							value={newGoal.cost || ""}
							onChange={(e) =>
								setNewGoal({
									...newGoal,
									cost: parseInt(e.target.value) || undefined,
								})
							}
						/>
						<textarea
							placeholder="Notes (optional)"
							value={newGoal.notes || ""}
							onChange={(e) =>
								setNewGoal({ ...newGoal, notes: e.target.value })
							}
						/>
						<div className="modal-actions">
							<button className="cancel-btn" onClick={() => setShowAdd(false)}>
								Cancel
							</button>
							<button className="save-btn" onClick={addGoal}>
								Add Goal
							</button>
						</div>
					</div>
				</div>
			)}

			{editingGoal && (
				<div className="modal-overlay" onClick={() => setEditingGoal(null)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Edit Goal</h3>
						<input
							type="text"
							value={editingGoal.title}
							onChange={(e) =>
								setEditingGoal({ ...editingGoal, title: e.target.value })
							}
						/>
						<select
							value={editingGoal.category}
							onChange={(e) =>
								setEditingGoal({ ...editingGoal, category: e.target.value })
							}
						>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<input
							type="text"
							placeholder="Location"
							value={editingGoal.location || ""}
							onChange={(e) =>
								setEditingGoal({ ...editingGoal, location: e.target.value })
							}
						/>
						<input
							type="number"
							placeholder="Cost"
							value={editingGoal.cost || ""}
							onChange={(e) =>
								setEditingGoal({
									...editingGoal,
									cost: parseInt(e.target.value) || undefined,
								})
							}
						/>
						<textarea
							placeholder="Notes"
							value={editingGoal.notes || ""}
							onChange={(e) =>
								setEditingGoal({ ...editingGoal, notes: e.target.value })
							}
						/>
						<div className="modal-actions">
							<button
								className="delete-btn"
								onClick={() => deleteGoal(editingGoal.id)}
							>
								Delete
							</button>
							<button
								className="save-btn"
								onClick={() => {
									setGoals(
										goals.map((g) =>
											g.id === editingGoal.id ? editingGoal : g,
										),
									);
									setEditingGoal(null);
								}}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #2d1b4e 0%, #1a0f2e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Quicksand', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin-top: 1rem; margin-bottom: 1.5rem; }
        .header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.25rem; background: linear-gradient(90deg, #a29bfe, #6c5ce7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .stats-row { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 1rem; }
        .stat-card { text-align: center; padding: 0.75rem 1.25rem; background: rgba(255,255,255,0.04); border-radius: 1rem; border: 1px solid rgba(255,255,255,0.05); min-width: 70px; }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 700; }
        .stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
        .progress-banner { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; margin-bottom: 1.5rem; }
        .progress-bar { flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #a29bfe, #6c5ce7); border-radius: 4px; transition: width 0.3s; }
        .progress-text { font-size: 0.85rem; color: #a29bfe; font-weight: 600; }
        .filter-tabs { display: flex; gap: 0.4rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .filter-tab { padding: 0.5rem 0.85rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.5rem; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .filter-tab.active { background: #6c5ce7; border-color: #6c5ce7; color: white; }
        .add-btn { width: 100%; padding: 0.85rem; background: linear-gradient(135deg, #a29bfe, #6c5ce7); border: none; border-radius: 0.75rem; color: white; font-weight: 600; font-size: 1rem; cursor: pointer; margin-bottom: 1.5rem; }
        .goals-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .empty-state { text-align: center; padding: 3rem 1rem; color: rgba(255,255,255,0.3); }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .empty-hint { font-size: 0.85rem; margin-top: 0.5rem; }
        .goal-card { background: rgba(255,255,255,0.04); border-radius: 1rem; padding: 1rem 1.25rem; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s; }
        .goal-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
        .goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .goal-category { padding: 0.2rem 0.6rem; border-radius: 0.75rem; font-size: 0.7rem; text-transform: uppercase; font-weight: 600; color: #1a0f2e; }
        .status-select { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; }
        .goal-title { margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 600; }
        .goal-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
        .meta-item { font-size: 0.8rem; color: rgba(255,255,255,0.5); }
        .goal-notes { margin: 0.5rem 0 0; font-size: 0.85rem; color: rgba(255,255,255,0.4); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #2d1b4e; border-radius: 1.25rem; padding: 1.5rem; width: 100%; max-width: 400px; max-height: 85vh; overflow-y: auto; }
        .modal h3 { margin: 0 0 1rem; color: #a29bfe; }
        .modal input, .modal select, .modal textarea { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 0.75rem; box-sizing: border-box; font-family: inherit; }
        .modal textarea { min-height: 80px; resize: vertical; }
        .modal-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .cancel-btn { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.08); border: none; border-radius: 0.5rem; color: white; cursor: pointer; }
        .delete-btn { flex: 1; padding: 0.75rem; background: rgba(255,107,107,0.2); border: none; border-radius: 0.5rem; color: #ff6b6b; cursor: pointer; }
        .save-btn { flex: 1; padding: 0.75rem; background: #a29bfe; border: none; border-radius: 0.5rem; color: #1a0f2e; font-weight: 600; cursor: pointer; }
      `}</style>
		</div>
	);
}
