import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Session {
	id: number;
	start: number;
	end: number;
	duration: number;
}

export default function StandCounter() {
	const [sessions, setSessions] = useState<Session[]>(() => {
		const saved = localStorage.getItem("stand-sessions");
		return saved ? JSON.parse(saved) : [];
	});
	const [active, setActive] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const [goal, setGoal] = useState(120);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		localStorage.setItem("stand-sessions", JSON.stringify(sessions));
	}, [sessions]);

	useEffect(() => {
		if (active) {
			intervalRef.current = window.setInterval(
				() => setElapsed((e) => e + 1),
				1000,
			);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [active]);

	const startSession = () => {
		setActive(true);
		setElapsed(0);
	};

	const endSession = () => {
		setSessions([
			...sessions,
			{
				id: Date.now(),
				start: Date.now() - elapsed * 1000,
				end: Date.now(),
				duration: elapsed,
			},
		]);
		setActive(false);
		setElapsed(0);
	};

	const todaySessions = sessions.filter((s) => {
		const today = new Date().toDateString();
		return new Date(s.start).toDateString() === today;
	});
	const todayTotal = todaySessions.reduce((a, s) => a + s.duration, 0);

	const formatTime = (s: number) =>
		`${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

	const weekData = Array.from({ length: 7 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - (6 - i));
		const dayStr = d.toDateString();
		return {
			day: d.toLocaleDateString("en", { weekday: "short" }),
			total: sessions
				.filter((s) => new Date(s.start).toDateString() === dayStr)
				.reduce((a, s) => a + s.duration, 0),
		};
	});

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(180deg, #1e3a5f 0%, #0d1b2a 100%)",
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
					Stand Counter
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track your standing desk time
				</p>

				<div
					style={{
						background: "rgba(255,255,255,0.1)",
						borderRadius: 24,
						padding: "2rem",
						textAlign: "center",
						marginBottom: "1.5rem",
					}}
				>
					<p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.6 }}>
						Today's standing time
					</p>
					<p
						style={{
							margin: "0.5rem 0",
							fontSize: "3.5rem",
							fontWeight: "bold",
						}}
					>
						{formatTime(todayTotal)}
					</p>
					<p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.5 }}>
						Goal: {formatTime(goal)}
					</p>
					<div
						style={{
							width: "100%",
							height: 8,
							background: "rgba(255,255,255,0.1)",
							borderRadius: 4,
							marginTop: "1rem",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								width: `${Math.min(100, (todayTotal / goal) * 100)}%`,
								height: "100%",
								background: todayTotal >= goal ? "#22c55e" : "#fbbf24",
								transition: "width 0.3s",
							}}
						/>
					</div>
				</div>

				<div
					style={{
						background: active ? "#22c55e" : "#fbbf24",
						borderRadius: 24,
						padding: "2rem",
						textAlign: "center",
						marginBottom: "1.5rem",
						transition: "background 0.3s",
					}}
				>
					<p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.7 }}>
						{active ? "Standing now" : "Current session"}
					</p>
					<p
						style={{ margin: "0.5rem 0", fontSize: "3rem", fontWeight: "bold" }}
					>
						{formatTime(elapsed)}
					</p>
					<button
						onClick={active ? endSession : startSession}
						style={{
							padding: "1rem 2rem",
							borderRadius: 12,
							border: "none",
							background: "white",
							color: active ? "#22c55e" : "#fbbf24",
							fontWeight: "bold",
							cursor: "pointer",
							fontSize: "1.1rem",
							marginTop: "0.5rem",
						}}
					>
						{active ? "End Session" : "Start Standing"}
					</button>
				</div>

				<div
					style={{
						background: "rgba(255,255,255,0.05)",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<p
						style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", opacity: 0.6 }}
					>
						Daily goal (minutes)
					</p>
					<input
						type="range"
						min="30"
						max="300"
						step="15"
						value={goal}
						onChange={(e) => setGoal(Number(e.target.value))}
						style={{ width: "100%", accentColor: "#fbbf24" }}
					/>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					This Week
				</h2>
				<div
					style={{
						display: "flex",
						gap: 4,
						height: 80,
						alignItems: "flex-end",
					}}
				>
					{weekData.map((d, i) => (
						<div
							key={i}
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
									background: d.total > 0 ? "#22c55e" : "rgba(255,255,255,0.1)",
									borderRadius: 4,
									height: `${Math.max(4, (d.total / 180) * 60)}px`,
									transition: "height 0.3s",
								}}
							/>
							<span style={{ fontSize: "0.65rem", opacity: 0.5 }}>{d.day}</span>
						</div>
					))}
				</div>

				<h2
					style={{ fontSize: "1.1rem", margin: "1.5rem 0 1rem", opacity: 0.8 }}
				>
					Recent Sessions
				</h2>
				{todaySessions
					.slice(-3)
					.reverse()
					.map((s) => (
						<div
							key={s.id}
							style={{
								display: "flex",
								justifyContent: "space-between",
								padding: "0.75rem",
								background: "rgba(255,255,255,0.05)",
								borderRadius: 8,
								marginBottom: "0.5rem",
							}}
						>
							<span style={{ opacity: 0.6 }}>
								{new Date(s.start).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							<span style={{ fontWeight: "bold" }}>
								{formatTime(s.duration)}
							</span>
						</div>
					))}
			</div>
		</div>
	);
}
