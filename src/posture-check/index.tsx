import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function PostureCheck() {
	const [goodCount, setGoodCount] = useState(0);
	const [badCount, setBadCount] = useState(0);
	const [intervalMin, setIntervalMin] = useState(30);
	const [timeLeft, setTimeLeft] = useState(intervalMin * 60);
	const [active, setActive] = useState(false);
	const ref = useRef<number | null>(null);

	useEffect(() => {
		const saved = localStorage.getItem("posture-stats");
		if (saved) {
			const d = JSON.parse(saved);
			setGoodCount(d.good || 0);
			setBadCount(d.bad || 0);
		}
	}, []);

	useEffect(() => {
		if (active && timeLeft > 0) {
			ref.current = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
		} else if (active && timeLeft === 0) {
			if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
			setTimeLeft(intervalMin * 60);
		}
		return () => {
			if (ref.current) clearInterval(ref.current);
		};
	}, [active, timeLeft, intervalMin]);

	const log = (isGood: boolean) => {
		if (isGood)
			setGoodCount((c) => {
				const n = c + 1;
				localStorage.setItem(
					"posture-stats",
					JSON.stringify({ good: n, bad: badCount }),
				);
				return n;
			});
		else
			setBadCount((c) => {
				const n = c + 1;
				localStorage.setItem(
					"posture-stats",
					JSON.stringify({ good: goodCount, bad: n }),
				);
				return n;
			});
		setActive(false);
		setTimeLeft(intervalMin * 60);
	};

	const score =
		goodCount + badCount
			? Math.round((goodCount / (goodCount + badCount)) * 100)
			: 0;
	const mins = Math.floor(timeLeft / 60);
	const secs = (timeLeft % 60).toString().padStart(2, "0");

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1a1a2e",
				color: "white",
				padding: "1.5rem",
				fontFamily: " system-ui",
				textAlign: "center",
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
			<h1 style={{ fontSize: "1.8rem", margin: "0 0 0.5rem" }}>
				Posture Check
			</h1>
			<p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
				Set reminders to check your posture
			</p>
			<div
				style={{
					fontSize: "4rem",
					fontWeight: 700,
					fontFamily: " monospace",
					marginBottom: "1rem",
				}}
			>
				{mins}:{secs}
			</div>
			<button
				onClick={() => setActive(!active)}
				style={{
					padding: "0.75rem 2rem",
					background: active ? "rgba(255,255,255,0.2)" : "#22c55e",
					border: "none",
					borderRadius: "2rem",
					color: "white",
					fontSize: "1rem",
					fontWeight: 600,
					cursor: "pointer",
					marginBottom: "2rem",
				}}
			>
				{active ? "Pause" : "Start Reminders"}
			</button>
			<div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
				<button
					onClick={() => log(true)}
					style={{
						flex: 1,
						padding: "1rem",
						background: "#22c55e",
						border: "none",
						borderRadius: "0.75rem",
						color: "white",
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					✓ Good
				</button>
				<button
					onClick={() => log(false)}
					style={{
						flex: 1,
						padding: "1rem",
						background: "#ef4444",
						border: "none",
						borderRadius: "0.75rem",
						color: "white",
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					✗ Bad
				</button>
			</div>
			<div
				style={{
					background: "rgba(255,255,255,0.05)",
					borderRadius: "1rem",
					padding: "1.5rem",
				}}
			>
				<div
					style={{
						fontSize: "2.5rem",
						fontWeight: 700,
						color:
							score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444",
					}}
				>
					{score}%
				</div>
				<p style={{ color: "rgba(255,255,255,0.5)", margin: "0.5rem 0 0" }}>
					Posture Score
				</p>
			</div>
			<div
				style={{
					marginTop: "1rem",
					fontSize: "0.85rem",
					color: "rgba(255,255,255,0.4)",
				}}
			>
				Good: {goodCount} • Bad: {badCount}
			</div>
		</div>
	);
}
