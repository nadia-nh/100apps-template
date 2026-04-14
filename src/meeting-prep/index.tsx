import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Topic {
	id: number;
	title: string;
	time: number;
	notes: string;
	completed: boolean;
}

export default function MeetingPrep() {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [newTopic, setNewTopic] = useState("");
	const [timeLimit, setTimeLimit] = useState(10);
	const [elapsed, setElapsed] = useState(0);
	const [running, setRunning] = useState(false);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		if (running) {
			intervalRef.current = window.setInterval(
				() => setElapsed((e) => e + 1),
				1000,
			);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running]);

	const addTopic = () => {
		if (!newTopic.trim()) return;
		setTopics([
			...topics,
			{
				id: Date.now(),
				title: newTopic,
				time: timeLimit,
				notes: "",
				completed: false,
			},
		]);
		setNewTopic("");
	};

	const updateTopic = (id: number, field: keyof Topic, value: unknown) => {
		setTopics(topics.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
	};

	const deleteTopic = (id: number) => {
		setTopics(topics.filter((t) => t.id !== id));
	};

	const totalTime = topics.reduce((a, t) => a + t.time, 0);
	const formatTime = (s: number) =>
		`${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#18181b",
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
					Meeting Prep
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Build your agenda
				</p>

				<div
					style={{
						background: "#27272a",
						borderRadius: 16,
						padding: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
					>
						<input
							type="text"
							placeholder="Topic"
							value={newTopic}
							onChange={(e) => setNewTopic(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addTopic()}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid rgba(255,255,255,0.1)",
								background: "#18181b",
								color: "white",
							}}
						/>
						<input
							type="number"
							value={timeLimit}
							onChange={(e) => setTimeLimit(Number(e.target.value))}
							style={{
								width: 60,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid rgba(255,255,255,0.1)",
								background: "#18181b",
								color: "white",
								textAlign: "center",
							}}
						/>
						<button
							onClick={addTopic}
							style={{
								padding: "0.75rem 1rem",
								borderRadius: 8,
								border: "none",
								background: "#3b82f6",
								color: "white",
								cursor: "pointer",
							}}
						>
							Add
						</button>
					</div>
					<p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.6 }}>
						Total: {totalTime} min
					</p>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "1rem",
						marginBottom: "1.5rem",
						background: "#27272a",
						borderRadius: 12,
						padding: "1rem",
					}}
				>
					<div style={{ textAlign: "center" }}>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.5 }}>
							Elapsed
						</p>
						<p
							style={{
								margin: 0,
								fontSize: "2rem",
								fontWeight: "bold",
								fontFamily: "monospace",
							}}
						>
							{formatTime(elapsed)}
						</p>
					</div>
					<button
						onClick={() => setRunning(!running)}
						style={{
							padding: "0.5rem 1.5rem",
							borderRadius: 8,
							border: "none",
							background: running ? "#ef4444" : "#22c55e",
							color: "white",
							cursor: "pointer",
							alignSelf: "center",
						}}
					>
						{running ? "Stop" : "Start"}
					</button>
				</div>

				{topics.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No topics yet</p>
				)}

				{topics.map((topic, i) => (
					<div
						key={topic.id}
						style={{
							background: "#27272a",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							borderLeft: topic.completed
								? "4px solid #22c55e"
								: "4px solid #3b82f6",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
							}}
						>
							<div style={{ flex: 1 }}>
								<span
									style={{
										fontSize: "0.75rem",
										opacity: 0.5,
										background: "rgba(255,255,255,0.1)",
										padding: "0.15rem 0.4rem",
										borderRadius: 4,
									}}
								>
									#{i + 1}
								</span>
								<h3
									style={{
										margin: "0.25rem 0",
										textDecoration: topic.completed ? "line-through" : "none",
										opacity: topic.completed ? 0.5 : 1,
									}}
								>
									{topic.title}
								</h3>
								<p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.6 }}>
									{topic.time} min
								</p>
							</div>
							<div style={{ display: "flex", gap: "0.25rem" }}>
								<button
									onClick={() =>
										updateTopic(topic.id, "completed", !topic.completed)
									}
									style={{
										padding: "0.3rem 0.6rem",
										borderRadius: 4,
										border: "none",
										background: topic.completed
											? "#22c55e"
											: "rgba(255,255,255,0.1)",
										color: "white",
										cursor: "pointer",
										fontSize: "0.7rem",
									}}
								>
									{topic.completed ? "Done" : "Done"}
								</button>
								<button
									onClick={() => deleteTopic(topic.id)}
									style={{
										padding: "0.3rem 0.6rem",
										borderRadius: 4,
										border: "none",
										background: "rgba(239,68,68,0.2)",
										color: "#ef4444",
										cursor: "pointer",
										fontSize: "0.7rem",
									}}
								>
									×
								</button>
							</div>
						</div>
						<textarea
							placeholder="Notes..."
							value={topic.notes}
							onChange={(e) => updateTopic(topic.id, "notes", e.target.value)}
							style={{
								width: "100%",
								marginTop: "0.75rem",
								padding: "0.5rem",
								borderRadius: 6,
								border: "1px solid rgba(255,255,255,0.1)",
								background: "#18181b",
								color: "white",
								fontSize: "0.9rem",
								resize: "none",
								height: 60,
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
