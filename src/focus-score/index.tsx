import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FocusEntry {
	date: string;
	score: number;
	note: string;
}

export default function FocusScore() {
	const [entries, setEntries] = useState<FocusEntry[]>(() => {
		const saved = localStorage.getItem("focus-entries");
		return saved ? JSON.parse(saved) : [];
	});
	const [todayScore, setTodayScore] = useState<number | null>(null);
	const [note, setNote] = useState("");
	const [showHistory, setShowHistory] = useState(false);

	const today = new Date().toISOString().split("T")[0];
	const todayEntry = entries.find((e) => e.date === today);

	useEffect(() => {
		localStorage.setItem("focus-entries", JSON.stringify(entries));
	}, [entries]);

	const handleSubmit = () => {
		if (todayScore === null) return;
		const newEntry: FocusEntry = { date: today, score: todayScore, note };
		const filtered = entries.filter((e) => e.date !== today);
		setEntries([newEntry, ...filtered]);
		setTodayScore(null);
		setNote("");
	};

	const weekData = entries.slice(0, 7);
	const avgScore =
		weekData.length > 0
			? Math.round(weekData.reduce((a, b) => a + b.score, 0) / weekData.length)
			: 0;

	const getScoreColor = (score: number) => {
		if (score >= 8) return "#22c55e";
		if (score >= 6) return "#eab308";
		if (score >= 4) return "#f97316";
		return "#ef4444";
	};

	const scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
				color: "white",
				padding: "2rem",
				fontFamily: "'Courier New', monospace",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(255,255,255,0.4)",
					textDecoration: "none",
					fontSize: "0.9rem",
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
						letterSpacing: "2px",
						textTransform: "uppercase",
					}}
				>
					Focus Score
				</h1>
				<p
					style={{
						textAlign: "center",
						color: "rgba(255,255,255,0.5)",
						marginBottom: "2rem",
					}}
				>
					{today}
				</p>

				{todayEntry ? (
					<div
						style={{
							background: "rgba(255,255,255,0.05)",
							borderRadius: 16,
							padding: "2rem",
							textAlign: "center",
							marginBottom: "2rem",
							border: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
							Today's focus score
						</p>
						<div
							style={{
								fontSize: "4rem",
								fontWeight: "bold",
								color: getScoreColor(todayEntry.score),
							}}
						>
							{todayEntry.score}
						</div>
						{todayEntry.note && (
							<p
								style={{
									marginTop: "1rem",
									color: "rgba(255,255,255,0.7)",
									fontStyle: "italic",
								}}
							>
								"{todayEntry.note}"
							</p>
						)}
					</div>
				) : (
					<>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								gap: "0.5rem",
								flexWrap: "wrap",
								marginBottom: "1.5rem",
							}}
						>
							{scores.map((s) => (
								<button
									key={s}
									onClick={() => setTodayScore(s)}
									style={{
										width: 44,
										height: 44,
										borderRadius: 8,
										border: "none",
										background:
											todayScore === s
												? getScoreColor(s)
												: "rgba(255,255,255,0.1)",
										color: todayScore === s ? "#000" : "white",
										fontWeight: "bold",
										cursor: "pointer",
										transition: "all 0.2s",
									}}
								>
									{s}
								</button>
							))}
						</div>

						<textarea
							placeholder="What impacted your focus today?"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							style={{
								width: "100%",
								padding: "1rem",
								borderRadius: 12,
								border: "1px solid rgba(255,255,255,0.1)",
								background: "rgba(255,255,255,0.05)",
								color: "white",
								fontSize: "1rem",
								resize: "none",
								height: 80,
								marginBottom: "1rem",
								fontFamily: "inherit",
							}}
						/>

						<button
							onClick={handleSubmit}
							disabled={todayScore === null}
							style={{
								width: "100%",
								padding: "1rem",
								borderRadius: 12,
								border: "none",
								background: todayScore ? "#22c55e" : "rgba(255,255,255,0.1)",
								color: todayScore ? "#000" : "rgba(255,255,255,0.3)",
								fontWeight: "bold",
								cursor: todayScore ? "pointer" : "not-allowed",
								fontSize: "1rem",
							}}
						>
							Log Focus Score
						</button>
					</>
				)}

				<div
					style={{
						marginTop: "2rem",
						background: "rgba(255,255,255,0.03)",
						borderRadius: 16,
						padding: "1.5rem",
						border: "1px solid rgba(255,255,255,0.05)",
					}}
				>
					<h2
						style={{
							fontSize: "1rem",
							marginBottom: "1rem",
							color: "rgba(255,255,255,0.7)",
							textTransform: "uppercase",
							letterSpacing: "1px",
						}}
					>
						Weekly Average:{" "}
						<span style={{ color: getScoreColor(avgScore) }}>{avgScore}</span>
					</h2>
					<div
						style={{
							display: "flex",
							gap: 4,
							height: 80,
							alignItems: "flex-end",
						}}
					>
						{weekData.map((e) => (
							<div
								key={e.date}
								style={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 4,
								}}
							>
								<div
									style={{
										width: "100%",
										background: getScoreColor(e.score),
										borderRadius: 4,
										height: `${e.score * 8}px`,
										transition: "height 0.3s",
									}}
								/>
								<span
									style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}
								>
									{new Date(e.date).getDay()}
								</span>
							</div>
						))}
					</div>
				</div>

				<button
					onClick={() => setShowHistory(!showHistory)}
					style={{
						marginTop: "2rem",
						background: "transparent",
						border: "1px solid rgba(255,255,255,0.2)",
						color: "rgba(255,255,255,0.6)",
						padding: "0.75rem 1.5rem",
						borderRadius: 8,
						cursor: "pointer",
						width: "100%",
					}}
				>
					{showHistory ? "Hide History" : "Show History"}
				</button>

				{showHistory && (
					<div style={{ marginTop: "1rem" }}>
						{entries.slice(7).map((e) => (
							<div
								key={e.date}
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "0.75rem",
									borderBottom: "1px solid rgba(255,255,255,0.05)",
								}}
							>
								<div>
									<span
										style={{
											color: "rgba(255,255,255,0.5)",
											fontSize: "0.9rem",
										}}
									>
										{e.date}
									</span>
									{e.note && (
										<p
											style={{
												color: "rgba(255,255,255,0.4)",
												fontSize: "0.8rem",
												marginTop: 4,
											}}
										>
											{e.note}
										</p>
									)}
								</div>
								<span
									style={{
										fontWeight: "bold",
										color: getScoreColor(e.score),
										fontSize: "1.2rem",
									}}
								>
									{e.score}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
