import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Task {
	id: number;
	name: string;
	frequencyMonths: number;
	lastCompleted?: string;
	cost?: number;
}

export default function HouseFix() {
	const [tasks, setTasks] = useState<Task[]>(() => {
		const saved = localStorage.getItem("house-tasks");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("house-tasks", JSON.stringify(tasks));
	}, [tasks]);

	const addTask = (name: string, frequencyMonths: number, cost?: number) => {
		setTasks([...tasks, { id: Date.now(), name, frequencyMonths, cost }]);
	};

	const completeTask = (id: number) => {
		setTasks(
			tasks.map((t) =>
				t.id === id
					? { ...t, lastCompleted: new Date().toISOString().split("T")[0] }
					: t,
			),
		);
	};

	const deleteTask = (id: number) => {
		setTasks(tasks.filter((t) => t.id !== id));
	};

	const getNextDue = (task: Task) => {
		if (!task.lastCompleted) return { overdue: false, days: 0 };
		const last = new Date(task.lastCompleted);
		const next = new Date(last);
		next.setMonth(next.getMonth() + task.frequencyMonths);
		const days = Math.ceil(
			(next.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);
		return { overdue: days < 0, days: Math.max(0, days) };
	};

	const upcoming = tasks
		.filter((t) => getNextDue(t).days <= 30)
		.sort((a, b) => getNextDue(a).days - getNextDue(b).days);
	const totalCost = tasks.reduce((a, t) => a + (t.cost || 0), 0);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e293b",
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

			<div style={{ maxWidth: 500, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					House Fix
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Home maintenance tracker
				</p>

				<AddTaskForm onAdd={addTask} />

				<div
					style={{
						background: "#334155",
						borderRadius: 12,
						padding: "1rem",
						marginTop: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<p style={{ margin: 0, opacity: 0.6, fontSize: "0.9rem" }}>
						Est. Annual Cost
					</p>
					<p
						style={{
							margin: "0.25rem 0",
							fontSize: "2rem",
							fontWeight: "bold",
						}}
					>
						${(totalCost * 12).toLocaleString()}
					</p>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Upcoming (30 days)
				</h2>
				{upcoming.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No tasks due soon</p>
				)}

				{upcoming.map((t) => {
					const due = getNextDue(t);
					return (
						<div
							key={t.id}
							style={{
								background: "#334155",
								borderRadius: 12,
								padding: "1rem",
								marginBottom: "0.75rem",
								borderLeft: due.overdue
									? "4px solid #ef4444"
									: due.days <= 7
										? "4px solid #f59e0b"
										: "4px solid #22c55e",
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
									<p style={{ margin: 0, fontWeight: "bold" }}>{t.name}</p>
									<p
										style={{
											margin: "0.25rem 0",
											fontSize: "0.8rem",
											opacity: 0.6,
										}}
									>
										Every {t.frequencyMonths}mo {t.cost && `· $${t.cost}`}
									</p>
								</div>
								<button
									onClick={() => deleteTask(t.id)}
									style={{
										background: "none",
										border: "none",
										color: "rgba(255,255,255,0.3)",
										cursor: "pointer",
									}}
								>
									×
								</button>
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginTop: "0.75rem",
								}}
							>
								<span
									style={{
										fontSize: "0.85rem",
										color: due.overdue
											? "#ef4444"
											: due.days <= 7
												? "#f59e0b"
												: "#22c55e",
									}}
								>
									{due.overdue
										? `${Math.abs(due.days)} days overdue`
										: `Due in ${due.days} days`}
								</span>
								<button
									onClick={() => completeTask(t.id)}
									style={{
										padding: "0.4rem 0.75rem",
										borderRadius: 6,
										border: "none",
										background: "#22c55e",
										color: "white",
										cursor: "pointer",
										fontSize: "0.85rem",
									}}
								>
									Done
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function AddTaskForm({
	onAdd,
}: {
	onAdd: (name: string, freq: number, cost?: number) => void;
}) {
	const [name, setName] = useState("");
	const [freq, setFreq] = useState(6);
	const [cost, setCost] = useState("");

	return (
		<div style={{ background: "#334155", borderRadius: 12, padding: "1rem" }}>
			<input
				type="text"
				placeholder="Task name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#1e293b",
					color: "white",
					marginBottom: "0.5rem",
				}}
			/>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
				<input
					type="number"
					placeholder="Frequency (months)"
					value={freq}
					onChange={(e) => setFreq(Number(e.target.value))}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "none",
						background: "#1e293b",
						color: "white",
					}}
				/>
				<input
					type="number"
					placeholder="Cost $"
					value={cost}
					onChange={(e) => setCost(e.target.value)}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "none",
						background: "#1e293b",
						color: "white",
					}}
				/>
			</div>
			<button
				onClick={() => {
					if (name) {
						onAdd(name, freq, cost ? Number(cost) : undefined);
						setName("");
						setCost("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#3b82f6",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Add Task
			</button>
		</div>
	);
}
