import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function TaskTunnel() {
	const [active, setActive] = useState(false);
	const [task, setTask] = useState("");
	const [elapsed, setElapsed] = useState(0);
	const [history, setHistory] = useState<
		{ task: string; duration: number; date: string }[]
	>(() => {
		const saved = localStorage.getItem("tunnel-history");
		return saved ? JSON.parse(saved) : [];
	});
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		localStorage.setItem("tunnel-history", JSON.stringify(history));
	}, [history]);

	useEffect(() => {
		if (active)
			intervalRef.current = window.setInterval(
				() => setElapsed((e) => e + 1),
				1000,
			);
		else if (intervalRef.current) clearInterval(intervalRef.current);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [active]);

	const start = () => {
		if (!task.trim()) return;
		setActive(true);
	};
	const complete = () => {
		setHistory([
			...history,
			{ task, duration: elapsed, date: new Date().toISOString().split("T")[0] },
		]);
		setActive(false);
		setElapsed(0);
	};
	const abandon = () => {
		setActive(false);
		setElapsed(0);
	};
	const fmt = (s: number) =>
		`${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#000",
				color: "#0f0",
				padding: "2rem",
				fontFamily: "'Courier New', monospace",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "#0f0",
					opacity: 0.5,
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
				}}
			>
				<h1
					style={{
						fontSize: "1.5rem",
						marginBottom: "2rem",
						textShadow: "0 0 10px #0f0",
					}}
				>
					TASK TUNNEL
				</h1>

				{!active ? (
					<>
						<p style={{ opacity: 0.7, marginBottom: "1rem" }}>
							What's your single task?
						</p>
						<input
							type="text"
							value={task}
							onChange={(e) => setTask(e.target.value)}
							placeholder="Enter task..."
							style={{
								width: 300,
								padding: "1rem",
								borderRadius: 8,
								border: "2px solid #0f0",
								background: "#000",
								color: "#0f0",
								fontSize: "1.1rem",
								fontFamily: "inherit",
								textAlign: "center",
							}}
						/>
						<button
							onClick={start}
							disabled={!task.trim()}
							style={{
								marginTop: "1rem",
								padding: "1rem 2rem",
								borderRadius: 8,
								border: "none",
								background: "#0f0",
								color: "#000",
								fontWeight: "bold",
								cursor: task.trim() ? "pointer" : "not-allowed",
							}}
						>
							ENTER TUNNEL
						</button>
					</>
				) : (
					<>
						<p style={{ opacity: 0.7, fontSize: "0.9rem" }}>FOCUSING ON</p>
						<p
							style={{
								fontSize: "1.5rem",
								marginBottom: "2rem",
								maxWidth: 400,
							}}
						>
							{task}
						</p>
						<p
							style={{
								fontSize: "5rem",
								fontWeight: "bold",
								textShadow: "0 0 20px #0f0",
							}}
						>
							{fmt(elapsed)}
						</p>
						<div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
							<button
								onClick={abandon}
								style={{
									padding: "0.75rem 1.5rem",
									borderRadius: 8,
									border: "1px solid #333",
									background: "transparent",
									color: "#666",
									cursor: "pointer",
								}}
							>
								ABANDON
							</button>
							<button
								onClick={complete}
								style={{
									padding: "0.75rem 1.5rem",
									borderRadius: 8,
									border: "none",
									background: "#0f0",
									color: "#000",
									fontWeight: "bold",
									cursor: "pointer",
								}}
							>
								COMPLETE
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
