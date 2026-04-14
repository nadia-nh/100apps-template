import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TinyWin() {
	const [wins, setWins] = useState<string[]>(() => {
		const saved = localStorage.getItem("tiny-wins");
		return saved ? JSON.parse(saved) : [];
	});
	const [newWin, setNewWin] = useState("");

	useEffect(() => {
		localStorage.setItem("tiny-wins", JSON.stringify(wins));
	}, [wins]);

	const addWin = () => {
		if (!newWin.trim()) return;
		setWins([newWin, ...wins]);
		setNewWin("");
	};
	const deleteWin = (i: number) => setWins(wins.filter((_, idx) => idx !== i));

	const todayWins = wins.slice(0, 5);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
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
					Tiny Win
				</h1>
				<p style={{ textAlign: "center", opacity: 0.7, marginBottom: "2rem" }}>
					Log small wins throughout the day
				</p>

				<div
					style={{
						background: "rgba(255,255,255,0.2)",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<input
							type="text"
							value={newWin}
							onChange={(e) => setNewWin(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addWin()}
							placeholder="What went well?"
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "white",
								color: "#000",
								fontSize: "1rem",
							}}
						/>
						<button
							onClick={addWin}
							style={{
								padding: "0.75rem 1.5rem",
								borderRadius: 8,
								border: "none",
								background: "white",
								color: "#f59e0b",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Log
						</button>
					</div>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
					Recent Wins
				</h2>
				{wins.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.5 }}>No wins yet today</p>
				)}
				{wins.map((win, i) => (
					<div
						key={i}
						style={{
							background: "rgba(255,255,255,0.15)",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
						}}
					>
						<span style={{ fontSize: "1.5rem" }}>⭐</span>
						<span style={{ flex: 1 }}>{win}</span>
						<button
							onClick={() => deleteWin(i)}
							style={{
								background: "none",
								border: "none",
								color: "rgba(255,255,255,0.5)",
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
