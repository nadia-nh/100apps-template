import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface MoodEntry {
	timestamp: string;
	mood: number;
	note: string;
}

export default function MoodWaves() {
	const [entries, setEntries] = useState<MoodEntry[]>(() => {
		const saved = localStorage.getItem("mood-waves");
		return saved ? JSON.parse(saved) : [];
	});
	const [mood, setMood] = useState(5);
	const [note, setNote] = useState("");
	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		localStorage.setItem("mood-waves", JSON.stringify(entries));
	}, [entries]);

	const logMood = () => {
		setEntries([
			...entries,
			{ timestamp: new Date().toISOString(), mood, note },
		]);
		setNote("");
	};

	const getMoodColor = (m: number) => {
		if (m >= 8) return "#22c55e";
		if (m >= 6) return "#84cc16";
		if (m >= 4) return "#eab308";
		if (m >= 2) return "#f97316";
		return "#ef4444";
	};

	const todayEntries = entries.filter((e) => e.timestamp.startsWith(today));
	const avgMood =
		todayEntries.length > 0
			? (
					todayEntries.reduce((a, b) => a + b.mood, 0) / todayEntries.length
				).toFixed(1)
			: null;

	const weekEntries = entries.filter((e) => {
		const d = new Date(e.timestamp);
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return d >= weekAgo;
	});

	const graphHeight = 100;
	const maxMood = 10;
	const graphData = Array.from({ length: 24 }, (_, h) => {
		const hourEntries = weekEntries.filter(
			(e) => new Date(e.timestamp).getHours() === h,
		);
		if (hourEntries.length === 0) return null;
		return hourEntries.reduce((a, b) => a + b.mood, 0) / hourEntries.length;
	});

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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

			<div style={{ maxWidth: 500, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					Mood Waves
				</h1>
				<p style={{ textAlign: "center", opacity: 0.7, marginBottom: "2rem" }}>
					Track your mood throughout the day
				</p>

				<div
					style={{
						background: "rgba(255,255,255,0.15)",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
						backdropFilter: "blur(10px)",
					}}
				>
					<p style={{ margin: "0 0 1rem", textAlign: "center" }}>
						How are you feeling?
					</p>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							gap: "0.5rem",
							marginBottom: "1rem",
						}}
					>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
							<button
								key={m}
								onClick={() => setMood(m)}
								style={{
									width: 32,
									height: 32,
									borderRadius: "50%",
									border: "none",
									background:
										mood === m ? getMoodColor(m) : "rgba(255,255,255,0.2)",
									color: "white",
									fontWeight: "bold",
									cursor: "pointer",
								}}
							>
								{m}
							</button>
						))}
					</div>
					<input
						type="text"
						placeholder="Note (optional)"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "rgba(255,255,255,0.9)",
							color: "#333",
							marginBottom: "0.75rem",
						}}
					/>
					<button
						onClick={logMood}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "white",
							color: "#764ba2",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Log Mood
					</button>
				</div>

				<div
					style={{
						background: "rgba(255,255,255,0.15)",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						textAlign: "center",
					}}
				>
					<p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
						Today's Average
					</p>
					<p
						style={{
							margin: "0.25rem 0",
							fontSize: "2.5rem",
							fontWeight: "bold",
						}}
					>
						{avgMood || "—"}
					</p>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Week Overview
				</h2>
				<div
					style={{
						background: "rgba(255,255,255,0.1)",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						height: 120,
						display: "flex",
						alignItems: "flex-end",
						gap: 2,
					}}
				>
					{graphData.map((v, i) => (
						<div
							key={i}
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<div
								style={{
									width: "100%",
									background: v ? getMoodColor(v) : "rgba(255,255,255,0.1)",
									borderRadius: 2,
									height: v ? `${(v / maxMood) * graphHeight}px` : "4px",
									transition: "height 0.3s",
								}}
							/>
						</div>
					))}
				</div>
				<p
					style={{
						textAlign: "center",
						fontSize: "0.75rem",
						opacity: 0.5,
						marginTop: "-1rem",
						marginBottom: "1.5rem",
					}}
				>
					Hour of day (past 7 days)
				</p>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Recent Entries
				</h2>
				{entries.slice(0, 10).map((e, i) => (
					<div
						key={i}
						style={{
							background: "rgba(255,255,255,0.1)",
							borderRadius: 8,
							padding: "0.75rem",
							marginBottom: "0.5rem",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div>
							<p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>
								{new Date(e.timestamp).toLocaleString()}
							</p>
							{e.note && (
								<p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
									{e.note}
								</p>
							)}
						</div>
						<span
							style={{
								fontSize: "1.5rem",
								fontWeight: "bold",
								color: getMoodColor(e.mood),
							}}
						>
							{e.mood}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
