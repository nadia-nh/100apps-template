import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface WeightEntry {
	date: string;
	weight: number;
}

export default function WeightTrack() {
	const [entries, setEntries] = useState<WeightEntry[]>(() => {
		const saved = localStorage.getItem("weight-log");
		return saved ? JSON.parse(saved) : [];
	});
	const [newWeight, setNewWeight] = useState("");
	const [goal, setGoal] = useState(() => {
		const saved = localStorage.getItem("weight-goal");
		return saved ? Number(saved) : 70;
	});

	useEffect(() => {
		localStorage.setItem("weight-log", JSON.stringify(entries));
		localStorage.setItem("weight-goal", String(goal));
	}, [entries, goal]);

	const addWeight = () => {
		if (!newWeight) return;
		const today = new Date().toISOString().split("T")[0];
		const filtered = entries.filter((e) => e.date !== today);
		setEntries([{ date: today, weight: Number(newWeight) }, ...filtered]);
		setNewWeight("");
	};

	const deleteEntry = (date: string) => {
		setEntries(entries.filter((e) => e.date !== date));
	};

	const latestWeight = entries[0]?.weight;
	const movingAvg =
		entries.length >= 7
			? (entries.slice(0, 7).reduce((a, b) => a + b.weight, 0) / 7).toFixed(1)
			: null;
	const progress = latestWeight
		? (((latestWeight - goal) / goal) * 100).toFixed(1)
		: null;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f8fafc",
				color: "#1e293b",
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
					color: "rgba(30,41,59,0.5)",
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
					Weight Track
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Log your weight
				</p>

				<div
					style={{
						background: "white",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
						boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
					}}
				>
					<p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.6 }}>
						Today's Weight (kg)
					</p>
					<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
						<input
							type="number"
							step="0.1"
							value={newWeight}
							onChange={(e) => setNewWeight(e.target.value)}
							placeholder="Weight"
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #e2e8f0",
								background: "#f8fafc",
								fontSize: "1.2rem",
							}}
						/>
						<button
							onClick={addWeight}
							style={{
								padding: "0.75rem 1.5rem",
								borderRadius: 8,
								border: "none",
								background: "#0ea5e9",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Log
						</button>
					</div>
				</div>

				<div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
					<div
						style={{
							flex: 1,
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
							Current
						</p>
						<p
							style={{
								margin: "0.25rem 0",
								fontSize: "1.5rem",
								fontWeight: "bold",
							}}
						>
							{latestWeight || "—"}
						</p>
					</div>
					<div
						style={{
							flex: 1,
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
							7-day Avg
						</p>
						<p
							style={{
								margin: "0.25rem 0",
								fontSize: "1.5rem",
								fontWeight: "bold",
							}}
						>
							{movingAvg || "—"}
						</p>
					</div>
					<div
						style={{
							flex: 1,
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>Goal</p>
						<input
							type="number"
							step="0.1"
							value={goal}
							onChange={(e) => setGoal(Number(e.target.value))}
							style={{
								width: 50,
								padding: "0.25rem",
								borderRadius: 4,
								border: "1px solid #e2e8f0",
								textAlign: "center",
								fontSize: "1.2rem",
								fontWeight: "bold",
							}}
						/>
					</div>
				</div>

				{latestWeight && (
					<div
						style={{
							background: Number(progress) <= 0 ? "#dcfce7" : "#fee2e2",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
							textAlign: "center",
						}}
					>
						<p
							style={{
								margin: 0,
								fontSize: "0.9rem",
								color: Number(progress) <= 0 ? "#166534" : "#991b1b",
							}}
						>
							{Number(progress) <= 0
								? `${Math.abs(Number(progress))}% to goal`
								: `${progress}% above goal`}
						</p>
					</div>
				)}

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					History
				</h2>
				{entries.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No entries yet</p>
				)}

				{entries.map((e) => (
					<div
						key={e.date}
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "0.75rem",
							background: "white",
							borderRadius: 8,
							marginBottom: "0.5rem",
							boxShadow: "0 1px 5px rgba(0,0,0,0.03)",
						}}
					>
						<span style={{ opacity: 0.6 }}>{e.date}</span>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<span style={{ fontWeight: "bold" }}>{e.weight} kg</span>
							<button
								onClick={() => deleteEntry(e.date)}
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
					</div>
				))}
			</div>
		</div>
	);
}
