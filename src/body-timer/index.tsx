import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function BodyTimer() {
	const [isActive, setIsActive] = useState(false);
	const [timeLeft, setTimeLeft] = useState(20 * 60);
	const [intervalMinutes, setIntervalMinutes] = useState(20);
	const [todaySessions, setTodaySessions] = useState(0);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		const saved = localStorage.getItem("body-timer-sessions");
		if (saved) {
			const data = JSON.parse(saved);
			if (data.date === new Date().toDateString()) setTodaySessions(data.count);
		}
	}, []);

	useEffect(() => {
		if (isActive && timeLeft > 0) {
			intervalRef.current = window.setInterval(
				() => setTimeLeft((t) => t - 1),
				1000,
			);
		} else if (isActive && timeLeft === 0) {
			if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
			setTodaySessions((s) => {
				const n = s + 1;
				localStorage.setItem(
					"body-timer-sessions",
					JSON.stringify({ date: new Date().toDateString(), count: n }),
				);
				return n;
			});
			setTimeLeft(intervalMinutes * 60);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isActive, timeLeft, intervalMinutes]);

	const progress = 1 - timeLeft / (intervalMinutes * 60);
	const mins = Math.floor(timeLeft / 60);
	const secs = (timeLeft % 60).toString().padStart(2, "0");

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0f172a",
				color: "#e2e8f0",
				padding: "1.5rem",
				fontFamily: "'JetBrains Mono',monospace",
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
					fontSize: "0.8rem",
					zIndex: 10,
				}}
			>
				← Back
			</Link>
			<div style={{ textAlign: "center", marginBottom: "2rem" }}>
				<h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 600 }}>
					20-20-20
				</h1>
				<p
					style={{
						color: "rgba(255,255,255,0.4)",
						fontSize: "0.85rem",
						marginTop: "0.25rem",
					}}
				>
					Rest your eyes
				</p>
			</div>
			<div
				style={{
					width: 220,
					height: 220,
					margin: "0 auto 2rem",
					position: "relative",
				}}
			>
				<svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
					<circle
						cx="50"
						cy="50"
						r="45"
						fill="none"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="6"
					/>
					<circle
						cx="50"
						cy="50"
						r="45"
						fill="none"
						stroke="#22c55e"
						strokeWidth="6"
						strokeLinecap="round"
						strokeDasharray={283}
						strokeDashoffset={283 * progress}
						transform="rotate(-90 50 50)"
					/>
				</svg>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%,-50%)",
						textAlign: "center",
					}}
				>
					<span
						style={{ display: "block", fontSize: "2.5rem", fontWeight: 600 }}
					>
						{mins}:{secs}
					</span>
					<span
						style={{
							fontSize: "0.8rem",
							color: "rgba(255,255,255,0.5)",
							textTransform: "uppercase",
						}}
					>
						{isActive ? "Focus" : "Paused"}
					</span>
				</div>
			</div>
			<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
				<span
					style={{
						display: "block",
						fontSize: "2rem",
						fontWeight: 700,
						color: "#22c55e",
					}}
				>
					{todaySessions}
				</span>
				<span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
					Sessions Today
				</span>
			</div>
			<button
				onClick={() => setIsActive(!isActive)}
				style={{
					width: "100%",
					padding: "1rem",
					background: isActive ? "rgba(255,255,255,0.1)" : "#22c55e",
					border: "none",
					borderRadius: "1rem",
					color: isActive ? "#e2e8f0" : "#0f172a",
					fontSize: "1rem",
					fontWeight: 600,
					cursor: "pointer",
					marginBottom: "1rem",
				}}
			>
				{isActive ? "Pause" : "Start Timer"}
			</button>
			<div
				style={{
					background: "rgba(255,255,255,0.05)",
					borderRadius: "0.75rem",
					padding: "1rem",
				}}
			>
				<label
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						fontSize: "0.9rem",
					}}
				>
					Interval (min):{" "}
					<input
						type="number"
						min="5"
						max="60"
						value={intervalMinutes}
						onChange={(e) => setIntervalMinutes(parseInt(e.target.value) || 20)}
						style={{
							width: 60,
							padding: "0.4rem",
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.25rem",
							color: "white",
							textAlign: "center",
						}}
					/>
				</label>
			</div>
		</div>
	);
}
