import { useState } from "react";
import { Link } from "react-router-dom";

export default function SleepClock() {
	const [bedtime, setBedtime] = useState("");
	const [waketime, setWaketime] = useState("");
	const [history, setHistory] = useState<{ date: string; duration: number }[]>(
		() => {
			const s = localStorage.getItem("sleep-history");
			return s ? JSON.parse(s) : [];
		},
	);

	const calculate = () => {
		if (!bedtime || !waketime) return;
		const b = new Date(`2000-01-01T${bedtime}`);
		const w = new Date(`2000-01-01T${waketime}`);
		let diff = (w.getTime() - b.getTime()) / (1000 * 60 * 60);
		if (diff < 0) diff += 24;
		const h = { date: new Date().toISOString().split("T")[0], duration: diff };
		setHistory([h, ...history.slice(0, 6)]);
		localStorage.setItem(
			"sleep-history",
			JSON.stringify([h, ...history.slice(0, 6)]),
		);
	};

	const avg = history.length
		? (history.reduce((s, h) => s + h.duration, 0) / history.length).toFixed(1)
		: "-";

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0c1445",
				color: "white",
				padding: "1.5rem",
				fontFamily: " system-ui",
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
				← Back
			</Link>
			<h1
				style={{
					textAlign: "center",
					fontSize: "1.8rem",
					margin: "0 0 0.5rem",
				}}
			>
				Sleep Clock
			</h1>
			<p
				style={{
					textAlign: "center",
					color: "rgba(255,255,255,0.5)",
					marginBottom: "2rem",
				}}
			>
				Track your sleep
			</p>
			<div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
				<div style={{ flex: 1 }}>
					<label
						style={{
							display: "block",
							fontSize: "0.8rem",
							marginBottom: "0.5rem",
							color: "rgba(255,255,255,0.6)",
						}}
					>
						Bedtime
					</label>
					<input
						type="time"
						value={bedtime}
						onChange={(e) => setBedtime(e.target.value)}
						style={{
							width: "100%",
							padding: "0.75rem",
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							fontSize: "1.1rem",
						}}
					/>
				</div>
				<div style={{ flex: 1 }}>
					<label
						style={{
							display: "block",
							fontSize: "0.8rem",
							marginBottom: "0.5rem",
							color: "rgba(255,255,255,0.6)",
						}}
					>
						Wake time
					</label>
					<input
						type="time"
						value={waketime}
						onChange={(e) => setWaketime(e.target.value)}
						style={{
							width: "100%",
							padding: "0.75rem",
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							fontSize: "1.1rem",
						}}
					/>
				</div>
			</div>
			<button
				onClick={calculate}
				style={{
					width: "100%",
					padding: "1rem",
					background: "linear-gradient(135deg, #667eea, #764ba2)",
					border: "none",
					borderRadius: "0.75rem",
					color: "white",
					fontWeight: 600,
					cursor: "pointer",
					marginBottom: "2rem",
				}}
			>
				Log Sleep
			</button>
			<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
				<span style={{ fontSize: "3rem", fontWeight: 700, color: "#764ba2" }}>
					{avg}
				</span>
				<br />
				<span style={{ color: "rgba(255,255,255,0.5)" }}>hrs avg (7 days)</span>
			</div>
			<div>
				{history.map((h) => (
					<div
						key={h.date}
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "0.75rem",
							background: "rgba(255,255,255,0.05)",
							borderRadius: "0.5rem",
							marginBottom: "0.5rem",
						}}
					>
						<span>{h.date}</span>
						<span>{h.duration.toFixed(1)} hrs</span>
					</div>
				))}
			</div>
		</div>
	);
}
