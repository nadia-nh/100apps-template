import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DoneLog() {
	const [tasks, setTasks] = useState<string[]>(() => {
		const saved = localStorage.getItem("done-log");
		return saved ? JSON.parse(saved) : [];
	});
	const [newTask, setNewTask] = useState("");

	useEffect(() => {
		localStorage.setItem("done-log", JSON.stringify(tasks));
	}, [tasks]);

	const addTask = () => {
		if (!newTask.trim()) return;
		setTasks([newTask, ...tasks]);
		setNewTask("");
	};
	const deleteTask = (i: number) =>
		setTasks(tasks.filter((_, idx) => idx !== i));

	const today = tasks.slice(0, 10);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f0fdf4",
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
					Done Log
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Log completed tasks
				</p>

				<div
					style={{
						background: "white",
						borderRadius: 12,
						padding: "1rem",
						boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						marginBottom: "1.5rem",
					}}
				>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<input
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addTask()}
							placeholder="What did you complete?"
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #dcfce7",
								fontSize: "1rem",
							}}
						/>
						<button
							onClick={addTask}
							style={{
								padding: "0.75rem 1.5rem",
								borderRadius: 8,
								border: "none",
								background: "#22c55e",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Log
						</button>
					</div>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Today
				</h2>
				{tasks.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No tasks logged</p>
				)}
				{tasks.map((task, i) => (
					<div
						key={i}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.5rem",
							boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
						}}
					>
						<span style={{ color: "#22c55e", fontSize: "1.2rem" }}>✓</span>
						<span style={{ flex: 1 }}>{task}</span>
						<button
							onClick={() => deleteTask(i)}
							style={{
								background: "none",
								border: "none",
								color: "#ef4444",
								cursor: "pointer",
							}}
						>
							×
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
