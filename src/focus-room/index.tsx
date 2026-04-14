import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const sessionTypes = [
	{ type: "deep", color: "#3b82f6", label: "Deep Work" },
	{ type: "creative", color: "#8b5cf6", label: "Creative" },
	{ type: "admin", color: "#f59e0b", label: "Administrative" },
];

export default function FocusRoom() {
	const [active, setActive] = useState(false);
	const [sessionType, setSessionType] = useState(sessionTypes[0].type);
	const [time, setTime] = useState(25 * 60);
	const [elapsed, setElapsed] = useState(0);
	const [history, setHistory] = useState<
		{ type: string; duration: number; date: string }[]
	>(() => {
		const saved = localStorage.getItem("focus-history");
		return saved ? JSON.parse(saved) : [];
	});
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		localStorage.setItem("focus-history", JSON.stringify(history));
	}, [history]);

	useEffect(() => {
		if (active && elapsed < time) {
			intervalRef.current = window.setInterval(
				() => setElapsed((e) => e + 1),
				1000,
			);
		} else if (elapsed >= time && intervalRef.current) {
			clearInterval(intervalRef.current);
			setHistory([
				...history,
				{
					type: sessionType,
					duration: elapsed,
					date: new Date().toISOString().split("T")[0],
				},
			]);
			setActive(false);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [active, elapsed, time]);

	const start = () => {
		setElapsed(0);
		setActive(true);
	};
	const stop = () => {
		if (elapsed > 0)
			setHistory([
				...history,
				{
					type: sessionType,
					duration: elapsed,
					date: new Date().toISOString().split("T")[0],
				},
			]);
		setActive(false);
		setElapsed(0);
	};
	const remaining = time - elapsed;
	const fmt = (s: number) =>
		`${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
	const session = sessionTypes.find((s) => s.type === sessionType)!;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#111",
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
			<div
				style={{
					maxWidth: 500,
					margin: "0 auto",
					paddingTop: "2rem",
					textAlign: "center",
				}}
			>
				<h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
					Focus Room
				</h1>
				<p style={{ opacity: 0.5, marginBottom: "2rem" }}>
					Themed focus sessions
				</p>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "0.5rem",
						marginBottom: "2rem",
					}}
				>
					{sessionTypes.map((s) => (
						<button
							key={s.type}
							onClick={() => setSessionType(s.type)}
							style={{
								padding: "0.75rem 1.5rem",
								borderRadius: 8,
								border: "none",
								background: sessionType === s.type ? s.color : "#222",
								color: "white",
								cursor: "pointer",
								fontWeight: sessionType === s.type ? "bold" : "normal",
							}}
						>
							{s.label}
						</button>
					))}
				</div>

				<div
					style={{
						background: session.color,
						borderRadius: "50%",
						width: 250,
						height: 250,
						margin: "0 auto 2rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: `0 0 60px ${session.color}40`,
					}}
				>
					<span style={{ fontSize: "4rem", fontWeight: "bold" }}>
						{fmt(remaining)}
					</span>
					<span style={{ opacity: 0.8 }}>{session.label}</span>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "1rem",
						marginBottom: "2rem",
					}}
				>
					{[25, 45, 60].map((m) => (
						<button
							key={m}
							onClick={() => setTime(m * 60)}
							style={{
								padding: "0.5rem 1rem",
								borderRadius: 8,
								border: "1px solid #333",
								background: time === m * 60 ? "#333" : "transparent",
								color: "white",
								cursor: "pointer",
							}}
						>
							{m}m
						</button>
					))}
				</div>

				{active ? (
					<button
						onClick={stop}
						style={{
							padding: "1rem 3rem",
							borderRadius: 12,
							border: "none",
							background: "#ef4444",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
							fontSize: "1.1rem",
						}}
					>
						Stop
					</button>
				) : (
					<button
						onClick={start}
						style={{
							padding: "1rem 3rem",
							borderRadius: 12,
							border: "none",
							background: session.color,
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
							fontSize: "1.1rem",
						}}
					>
						Start Focus
					</button>
				)}

				<h2 style={{ marginTop: "2rem", opacity: 0.7 }}>Today's Sessions</h2>
				{history
					.filter((h) => h.date === new Date().toISOString().split("T")[0])
					.map((h, i) => (
						<div
							key={i}
							style={{
								background: "#222",
								padding: "0.75rem",
								borderRadius: 8,
								marginBottom: "0.5rem",
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<span>{sessionTypes.find((s) => s.type === h.type)?.label}</span>
							<span>
								{Math.floor(h.duration / 60)}m {h.duration % 60}s
							</span>
						</div>
					))}
			</div>
		</div>
	);
}
