import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Goal {
	id: number;
	name: string;
	targetDate: string;
	milestones: { id: number; text: string; completed: boolean }[];
}

export default function GoalPath() {
	const [goals, setGoals] = useState<Goal[]>(() => {
		const saved = localStorage.getItem("goal-path");
		return saved ? JSON.parse(saved) : [];
	});
	const [newGoal, setNewGoal] = useState("");
	const [targetDate, setTargetDate] = useState("");
	const [showAdd, setShowAdd] = useState(false);

	useEffect(() => {
		localStorage.setItem("goal-path", JSON.stringify(goals));
	}, [goals]);

	const addGoal = () => {
		if (!newGoal.trim() || !targetDate) return;
		setGoals([
			...goals,
			{ id: Date.now(), name: newGoal, targetDate, milestones: [] },
		]);
		setNewGoal("");
		setTargetDate("");
		setShowAdd(false);
	};

	const addMilestone = (goalId: number, text: string) => {
		if (!text.trim()) return;
		setGoals(
			goals.map((g) =>
				g.id === goalId
					? {
							...g,
							milestones: [
								...g.milestones,
								{ id: Date.now(), text, completed: false },
							],
						}
					: g,
			),
		);
	};

	const toggleMilestone = (goalId: number, milestoneId: number) => {
		setGoals(
			goals.map((g) =>
				g.id === goalId
					? {
							...g,
							milestones: g.milestones.map((m) =>
								m.id === milestoneId ? { ...m, completed: !m.completed } : m,
							),
						}
					: g,
			),
		);
	};

	const deleteGoal = (id: number) => {
		setGoals(goals.filter((g) => g.id !== id));
	};

	const getProgress = (goal: Goal) => {
		if (goal.milestones.length === 0) return 0;
		return Math.round(
			(goal.milestones.filter((m) => m.completed).length /
				goal.milestones.length) *
				100,
		);
	};

	const daysLeft = (date: string) => {
		const diff = new Date(date).getTime() - Date.now();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e1b4b",
				color: "white",
				padding: "2rem",
				fontFamily: "system-ui",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(255,255,255,0.5)",
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>

			<div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					Goal Path
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track milestones to your goals
				</p>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "2px dashed rgba(255,255,255,0.2)",
						background: "transparent",
						color: "white",
						cursor: "pointer",
						marginBottom: "1.5rem",
					}}
				>
					+ Add Goal
				</button>

				{showAdd && (
					<div
						style={{
							background: "#312e81",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
						}}
					>
						<input
							type="text"
							placeholder="Goal name"
							value={newGoal}
							onChange={(e) => setNewGoal(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#1e1b4b",
								color: "white",
								marginBottom: "0.5rem",
							}}
						/>
						<input
							type="date"
							value={targetDate}
							onChange={(e) => setTargetDate(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#1e1b4b",
								color: "white",
								marginBottom: "0.75rem",
							}}
						/>
						<button
							onClick={addGoal}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#6366f1",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Create Goal
						</button>
					</div>
				)}

				{goals.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No goals yet</p>
				)}

				{goals.map((goal) => {
					const progress = getProgress(goal);
					const days = daysLeft(goal.targetDate);
					return (
						<div
							key={goal.id}
							style={{
								background: "#312e81",
								borderRadius: 16,
								padding: "1.5rem",
								marginBottom: "1rem",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
								}}
							>
								<div>
									<h3 style={{ margin: 0, fontSize: "1.2rem" }}>{goal.name}</h3>
									<p
										style={{
											margin: "0.25rem 0 0",
											fontSize: "0.85rem",
											opacity: 0.6,
										}}
									>
										Target: {new Date(goal.targetDate).toLocaleDateString()}
									</p>
								</div>
								<button
									onClick={() => deleteGoal(goal.id)}
									style={{
										background: "transparent",
										border: "none",
										color: "rgba(255,255,255,0.3)",
										cursor: "pointer",
										fontSize: "1.2rem",
									}}
								>
									×
								</button>
							</div>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.75rem",
									margin: "1rem 0",
								}}
							>
								<div
									style={{
										flex: 1,
										height: 8,
										background: "rgba(255,255,255,0.1)",
										borderRadius: 4,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${progress}%`,
											background: progress === 100 ? "#22c55e" : "#6366f1",
											transition: "width 0.3s",
										}}
									/>
								</div>
								<span style={{ fontWeight: "bold", minWidth: 40 }}>
									{progress}%
								</span>
							</div>

							<p
								style={{
									margin: "0 0 1rem",
									fontSize: "0.85rem",
									color:
										days < 0 ? "#ef4444" : days < 7 ? "#fbbf24" : "#22c55e",
								}}
							>
								{days < 0
									? `${Math.abs(days)} days overdue`
									: `${days} days left`}
							</p>

							{goal.milestones.map((m) => (
								<div
									key={m.id}
									onClick={() => toggleMilestone(goal.id, m.id)}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
										padding: "0.5rem",
										background: "rgba(255,255,255,0.05)",
										borderRadius: 8,
										marginBottom: "0.5rem",
										cursor: "pointer",
									}}
								>
									<span
										style={{
											width: 20,
											height: 20,
											borderRadius: "50%",
											border: `2px solid ${m.completed ? "#22c55e" : "#6366f1"}`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{m.completed && "✓"}
									</span>
									<span
										style={{
											textDecoration: m.completed ? "line-through" : "none",
											opacity: m.completed ? 0.5 : 1,
										}}
									>
										{m.text}
									</span>
								</div>
							))}

							<MilestoneInput onAdd={(text) => addMilestone(goal.id, text)} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

function MilestoneInput({ onAdd }: { onAdd: (text: string) => void }) {
	const [text, setText] = useState("");
	return (
		<div style={{ display: "flex", gap: "0.5rem" }}>
			<input
				type="text"
				placeholder="Add milestone"
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && (onAdd(text), setText(""))}
				style={{
					flex: 1,
					padding: "0.5rem",
					borderRadius: 6,
					border: "1px solid rgba(255,255,255,0.2)",
					background: "transparent",
					color: "white",
					fontSize: "0.9rem",
				}}
			/>
			<button
				onClick={() => {
					onAdd(text);
					setText("");
				}}
				style={{
					padding: "0.5rem 1rem",
					borderRadius: 6,
					border: "none",
					background: "#6366f1",
					color: "white",
					cursor: "pointer",
				}}
			>
				+
			</button>
		</div>
	);
}
