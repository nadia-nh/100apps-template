import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Thought {
	id: number;
	text: string;
	type: "idea" | "worry" | "task" | "note";
	resolved: boolean;
	timestamp: string;
}

export default function ThoughtCatch() {
	const [thoughts, setThoughts] = useState<Thought[]>(() => {
		const saved = localStorage.getItem("thoughts");
		return saved ? JSON.parse(saved) : [];
	});
	const [newThought, setNewThought] = useState("");
	const [type, setType] = useState<Thought["type"]>("idea");
	const [showResolved, setShowResolved] = useState(false);

	useEffect(() => {
		localStorage.setItem("thoughts", JSON.stringify(thoughts));
	}, [thoughts]);

	const addThought = () => {
		if (!newThought.trim()) return;
		setThoughts([
			{
				id: Date.now(),
				text: newThought,
				type,
				resolved: false,
				timestamp: new Date().toISOString(),
			},
			...thoughts,
		]);
		setNewThought("");
	};

	const toggleResolved = (id: number) => {
		setThoughts(
			thoughts.map((t) => (t.id === id ? { ...t, resolved: !t.resolved } : t)),
		);
	};

	const deleteThought = (id: number) => {
		setThoughts(thoughts.filter((t) => t.id !== id));
	};

	const types = [
		{ t: "idea", c: "#22c55e" },
		{ t: "worry", c: "#f59e0b" },
		{ t: "task", c: "#3b82f6" },
		{ t: "note", c: "#a78bfa" },
	] as const;

	const activeThoughts = thoughts.filter((t) => !t.resolved);
	const resolvedThoughts = thoughts.filter((t) => t.resolved);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1a1a1a",
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
					Thought Catch
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Capture ideas and worries
				</p>

				<div
					style={{
						background: "#2a2a2a",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
					>
						{types.map((ty) => (
							<button
								key={ty.t}
								onClick={() => setType(ty.t)}
								style={{
									flex: 1,
									padding: "0.5rem",
									borderRadius: 6,
									border: "none",
									background: type === ty.t ? ty.c : "#3a3a3a",
									color: "white",
									cursor: "pointer",
									textTransform: "capitalize",
									fontSize: "0.8rem",
								}}
							>
								{ty.t}
							</button>
						))}
					</div>
					<textarea
						placeholder="What's on your mind?"
						value={newThought}
						onChange={(e) => setNewThought(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && addThought()}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#1a1a1a",
							color: "white",
							resize: "none",
							height: 60,
							marginBottom: "0.75rem",
						}}
					/>
					<button
						onClick={addThought}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#22c55e",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Catch It
					</button>
				</div>

				{activeThoughts.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>
						No thoughts to process
					</p>
				)}

				{activeThoughts.map((thought) => {
					const ty = types.find((t) => t.t === thought.type)!;
					return (
						<div
							key={thought.id}
							style={{
								background: "#2a2a2a",
								borderRadius: 12,
								padding: "1rem",
								marginBottom: "0.75rem",
								borderLeft: `4px solid ${ty.c}`,
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
									<span
										style={{
											fontSize: "0.7rem",
											color: ty.c,
											textTransform: "uppercase",
										}}
									>
										{thought.type}
									</span>
									<p style={{ margin: "0.25rem 0", fontSize: "1rem" }}>
										{thought.text}
									</p>
									<p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.4 }}>
										{new Date(thought.timestamp).toLocaleString()}
									</p>
								</div>
								<button
									onClick={() => toggleResolved(thought.id)}
									style={{
										background: "transparent",
										border: "1px solid #22c55e",
										color: "#22c55e",
										padding: "0.25rem 0.5rem",
										borderRadius: 4,
										cursor: "pointer",
										fontSize: "0.7rem",
									}}
								>
									Done
								</button>
							</div>
							<button
								onClick={() => deleteThought(thought.id)}
								style={{
									marginTop: "0.5rem",
									background: "transparent",
									border: "none",
									color: "rgba(255,255,255,0.3)",
									cursor: "pointer",
									fontSize: "0.75rem",
								}}
							>
								Delete
							</button>
						</div>
					);
				})}

				{resolvedThoughts.length > 0 && (
					<button
						onClick={() => setShowResolved(!showResolved)}
						style={{
							marginTop: "1.5rem",
							background: "transparent",
							border: "1px solid rgba(255,255,255,0.2)",
							color: "rgba(255,255,255,0.5)",
							padding: "0.75rem",
							borderRadius: 8,
							cursor: "pointer",
							width: "100%",
						}}
					>
						{showResolved ? "Hide" : "Show"} Resolved ({resolvedThoughts.length}
						)
					</button>
				)}

				{showResolved &&
					resolvedThoughts.map((thought) => (
						<div
							key={thought.id}
							style={{
								background: "rgba(255,255,255,0.02)",
								borderRadius: 12,
								padding: "1rem",
								marginTop: "0.75rem",
								opacity: 0.5,
								textDecoration: "line-through",
							}}
						>
							<p style={{ margin: 0 }}>{thought.text}</p>
							<button
								onClick={() => toggleResolved(thought.id)}
								style={{
									marginTop: "0.5rem",
									background: "transparent",
									border: "none",
									color: "#22c55e",
									cursor: "pointer",
									fontSize: "0.75rem",
								}}
							>
								Restore
							</button>
						</div>
					))}
			</div>
		</div>
	);
}
