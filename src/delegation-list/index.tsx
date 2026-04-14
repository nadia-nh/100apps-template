import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Task {
	id: number;
	name: string;
	timeEst: number;
	costEst?: number;
	status: "todo" | "delegated" | "done";
}

export default function DelegationList() {
	const [tasks, setTasks] = useState<Task[]>(() => {
		const saved = localStorage.getItem("delegation-tasks");
		return saved ? JSON.parse(saved) : [];
	});
	const [newTask, setNewTask] = useState("");
	const [timeEst, setTimeEst] = useState(30);

	useEffect(() => {
		localStorage.setItem("delegation-tasks", JSON.stringify(tasks));
	}, [tasks]);

	const addTask = () => {
		if (!newTask.trim()) return;
		setTasks([
			...tasks,
			{ id: Date.now(), name: newTask, timeEst, status: "todo" },
		]);
		setNewTask("");
	};
	const updateStatus = (id: number, status: Task["status"]) =>
		setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
	const deleteTask = (id: number) => setTasks(tasks.filter((t) => t.id !== id));

	const totalTime = tasks
		.filter((t) => t.status === "todo")
		.reduce((a, t) => a + t.timeEst, 0);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#fef3c7",
				color: "#1f2937",
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
					color: "rgba(31,41,55,0.5)",
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
					Delegation List
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Tasks to delegate or outsource
				</p>

				<div
					style={{
						background: "white",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
					}}
				>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
					>
						<input
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							placeholder="Task name"
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #fcd34d",
								fontSize: "1rem",
							}}
						/>
						<input
							type="number"
							value={timeEst}
							onChange={(e) => setTimeEst(Number(e.target.value))}
							style={{
								width: 70,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #fcd34d",
								textAlign: "center",
							}}
						/>
					</div>
					<button
						onClick={addTask}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#f59e0b",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Add Task
					</button>
				</div>

				<div
					style={{
						background: "#fcd34d",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						textAlign: "center",
					}}
				>
					<p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
						Time to delegate
					</p>
					<p
						style={{
							margin: "0.25rem 0",
							fontSize: "1.5rem",
							fontWeight: "bold",
						}}
					>
						{Math.floor(totalTime / 60)}h {totalTime % 60}m
					</p>
				</div>

				{["todo", "delegated", "done"].map((status) => (
					<div key={status}>
						<h3
							style={{
								textTransform: "capitalize",
								opacity: 0.7,
								marginBottom: "0.5rem",
							}}
						>
							{status === "todo"
								? "To Delegate"
								: status === "delegated"
									? "Delegated"
									: "Done"}
						</h3>
						{tasks
							.filter((t) => t.status === status)
							.map((t) => (
								<div
									key={t.id}
									style={{
										background: "white",
										borderRadius: 12,
										padding: "1rem",
										marginBottom: "0.5rem",
										boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div>
										<p style={{ margin: 0, fontWeight: "bold" }}>{t.name}</p>
										<p
											style={{
												margin: "0.25rem 0 0",
												fontSize: "0.8rem",
												opacity: 0.6,
											}}
										>
											{t.timeEst} min
										</p>
									</div>
									<div style={{ display: "flex", gap: "0.25rem" }}>
										{status !== "todo" && (
											<button
												onClick={() => updateStatus(t.id, "todo")}
												style={{
													padding: "0.25rem 0.5rem",
													borderRadius: 4,
													border: "none",
													background: "#fef3c7",
													color: "#92400e",
													cursor: "pointer",
													fontSize: "0.7rem",
												}}
											>
												←
											</button>
										)}
										{status !== "delegated" && (
											<button
												onClick={() => updateStatus(t.id, "delegated")}
												style={{
													padding: "0.25rem 0.5rem",
													borderRadius: 4,
													border: "none",
													background: "#dbeafe",
													color: "#1e40af",
													cursor: "pointer",
													fontSize: "0.7rem",
												}}
											>
												→
											</button>
										)}
										{status !== "done" && (
											<button
												onClick={() => updateStatus(t.id, "done")}
												style={{
													padding: "0.25rem 0.5rem",
													borderRadius: 4,
													border: "none",
													background: "#d1fae5",
													color: "#065f46",
													cursor: "pointer",
													fontSize: "0.7rem",
												}}
											>
												✓
											</button>
										)}
										<button
											onClick={() => deleteTask(t.id)}
											style={{
												padding: "0.25rem 0.5rem",
												borderRadius: 4,
												border: "none",
												background: "#fee2e2",
												color: "#991b1b",
												cursor: "pointer",
												fontSize: "0.7rem",
											}}
										>
											×
										</button>
									</div>
								</div>
							))}
					</div>
				))}
			</div>
		</div>
	);
}
