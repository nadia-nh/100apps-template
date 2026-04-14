import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface EnergyEntry {
	time: string;
	level: number;
	activity: string;
}

export default function EnergyMap() {
	const [entries, setEntries] = useState<EnergyEntry[]>(() => {
		const saved = localStorage.getItem("energy-entries");
		return saved ? JSON.parse(saved) : [];
	});
	const [level, setLevel] = useState<number>(5);
	const [activity, setActivity] = useState("");
	const [period, setPeriod] = useState<"morning" | "afternoon" | "evening">(
		"morning",
	);

	useEffect(() => {
		localStorage.setItem("energy-entries", JSON.stringify(entries));
	}, [entries]);

	const logEnergy = () => {
		const time = `${period}-${new Date().toTimeString().slice(0, 5)}`;
		setEntries([...entries, { time, level, activity }]);
		setActivity("");
	};

	const periods = ["morning", "afternoon", "evening"] as const;
	const getPeriodData = (p: (typeof periods)[number]) =>
		entries.filter((e) => e.time.startsWith(p));

	const avgEnergy = (p: (typeof periods)[number]) => {
		const data = getPeriodData(p);
		if (!data.length) return 0;
		return Math.round(data.reduce((a, b) => a + b.level, 0) / data.length);
	};

	const getColor = (l: number) =>
		l >= 7 ? "#22c55e" : l >= 4 ? "#eab308" : "#ef4444";

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
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
					color: "rgba(255,255,255,0.7)",
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>

			<div style={{ maxWidth: 500, margin: "0 auto", paddingTop: "3rem" }}>
				<h1
					style={{
						fontSize: "1.5rem",
						textAlign: "center",
						marginBottom: "2rem",
					}}
				>
					Energy Map
				</h1>

				<div
					style={{
						background: "rgba(0,0,0,0.2)",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<p style={{ marginBottom: "1rem", opacity: 0.8 }}>Time of day</p>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						{periods.map((p) => (
							<button
								key={p}
								onClick={() => setPeriod(p)}
								style={{
									flex: 1,
									padding: "0.75rem",
									borderRadius: 8,
									border: "none",
									background: period === p ? "white" : "rgba(255,255,255,0.2)",
									color: period === p ? "#134e5e" : "white",
									cursor: "pointer",
									textTransform: "capitalize",
								}}
							>
								{p}
							</button>
						))}
					</div>
				</div>

				<div
					style={{
						background: "rgba(0,0,0,0.2)",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<p style={{ marginBottom: "1rem", opacity: 0.8 }}>
						Energy level: {level}
					</p>
					<input
						type="range"
						min="1"
						max="10"
						value={level}
						onChange={(e) => setLevel(Number(e.target.value))}
						style={{ width: "100%", accentColor: getColor(level) }}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							fontSize: "0.8rem",
							opacity: 0.6,
							marginTop: "0.5rem",
						}}
					>
						<span>Low</span>
						<span>High</span>
					</div>
				</div>

				<input
					type="text"
					placeholder="What are you doing?"
					value={activity}
					onChange={(e) => setActivity(e.target.value)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "none",
						background: "rgba(255,255,255,0.9)",
						color: "#333",
						marginBottom: "1rem",
						fontSize: "1rem",
					}}
				/>

				<button
					onClick={logEnergy}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "none",
						background: "#fff",
						color: "#134e5e",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					Log Energy
				</button>

				<h2 style={{ marginTop: "2rem", fontSize: "1.1rem", opacity: 0.8 }}>
					Period Averages
				</h2>
				<div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
					{periods.map((p) => (
						<div
							key={p}
							style={{
								flex: 1,
								background: "rgba(0,0,0,0.2)",
								borderRadius: 12,
								padding: "1rem",
								textAlign: "center",
							}}
						>
							<p
								style={{
									fontSize: "0.8rem",
									opacity: 0.7,
									textTransform: "capitalize",
								}}
							>
								{p}
							</p>
							<p
								style={{
									fontSize: "1.5rem",
									fontWeight: "bold",
									color: getColor(avgEnergy(p)),
								}}
							>
								{avgEnergy(p) || "-"}
							</p>
						</div>
					))}
				</div>

				<h2 style={{ marginTop: "2rem", fontSize: "1.1rem", opacity: 0.8 }}>
					Recent Entries
				</h2>
				<div style={{ marginTop: "1rem" }}>
					{entries
						.slice(-5)
						.reverse()
						.map((e, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									justifyContent: "space-between",
									padding: "0.75rem",
									background: "rgba(0,0,0,0.1)",
									borderRadius: 8,
									marginBottom: "0.5rem",
								}}
							>
								<div>
									<span style={{ opacity: 0.6, fontSize: "0.85rem" }}>
										{e.time}
									</span>
									<p style={{ margin: 0 }}>{e.activity || "—"}</p>
								</div>
								<span style={{ fontWeight: "bold", color: getColor(e.level) }}>
									{e.level}
								</span>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
