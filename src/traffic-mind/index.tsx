import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Commute {
	id: number;
	route: string;
	estimated: number;
	actual: number;
	date: string;
	timeOfDay: "morning" | "evening";
}

export default function TrafficMind() {
	const [commutes, setCommutes] = useState<Commute[]>(() => {
		const saved = localStorage.getItem("commutes");
		return saved ? JSON.parse(saved) : [];
	});
	const [newCommute, setNewCommute] = useState<{
		route: string;
		estimated: number;
		actual: string;
		timeOfDay: "morning" | "evening";
	}>({
		route: "Home to Work",
		estimated: 30,
		actual: "",
		timeOfDay: "morning",
	});

	useEffect(() => {
		localStorage.setItem("commutes", JSON.stringify(commutes));
	}, [commutes]);

	const addCommute = () => {
		if (!newCommute.actual) return;
		setCommutes([
			{
				id: Date.now(),
				route: newCommute.route,
				estimated: newCommute.estimated,
				actual: Number(newCommute.actual),
				date: new Date().toISOString().split("T")[0],
				timeOfDay: newCommute.timeOfDay,
			},
			...commutes,
		]);
		setNewCommute({ ...newCommute, actual: "" });
	};

	const avgDiff =
		commutes.length > 0
			? Math.round(
					commutes.reduce((a, c) => a + (c.actual - c.estimated), 0) /
						commutes.length,
				)
			: 0;

	const routes = [...new Set(commutes.map((c) => c.route))];
	const routeStats = routes.map((r) => {
		const routeCommutes = commutes.filter((c) => c.route === r);
		const avg = routeCommutes.length
			? Math.round(
					routeCommutes.reduce((a, c) => a + c.actual, 0) /
						routeCommutes.length,
				)
			: 0;
		const best = routeCommutes.length
			? Math.min(...routeCommutes.map((c) => c.actual))
			: 0;
		const worst = routeCommutes.length
			? Math.max(...routeCommutes.map((c) => c.actual))
			: 0;
		return { route: r, avg, best, worst, count: routeCommutes.length };
	});

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1f2937",
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
					Traffic Mind
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Commute time tracker
				</p>

				<div
					style={{
						background: "#374151",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<input
						type="text"
						value={newCommute.route}
						onChange={(e) =>
							setNewCommute({ ...newCommute, route: e.target.value })
						}
						placeholder="Route (e.g., Home to Work)"
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#1f2937",
							color: "white",
							marginBottom: "0.5rem",
						}}
					/>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
					>
						<input
							type="number"
							placeholder="Est. min"
							value={newCommute.estimated}
							onChange={(e) =>
								setNewCommute({
									...newCommute,
									estimated: Number(e.target.value),
								})
							}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#1f2937",
								color: "white",
							}}
						/>
						<input
							type="number"
							placeholder="Actual min"
							value={newCommute.actual}
							onChange={(e) =>
								setNewCommute({ ...newCommute, actual: e.target.value })
							}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#1f2937",
								color: "white",
							}}
						/>
					</div>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<button
							onClick={() =>
								setNewCommute({ ...newCommute, timeOfDay: "morning" })
							}
							style={{
								flex: 1,
								padding: "0.5rem",
								borderRadius: 8,
								border: "none",
								background:
									newCommute.timeOfDay === "morning" ? "#f59e0b" : "#1f2937",
								color: "white",
								cursor: "pointer",
							}}
						>
							🌅 Morning
						</button>
						<button
							onClick={() =>
								setNewCommute({ ...newCommute, timeOfDay: "evening" })
							}
							style={{
								flex: 1,
								padding: "0.5rem",
								borderRadius: 8,
								border: "none",
								background:
									newCommute.timeOfDay === "evening" ? "#8b5cf6" : "#1f2937",
								color: "white",
								cursor: "pointer",
							}}
						>
							🌆 Evening
						</button>
					</div>
					<button
						onClick={addCommute}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#22c55e",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
							marginTop: "0.75rem",
						}}
					>
						Log Commute
					</button>
				</div>

				<div
					style={{
						background:
							avgDiff > 0 ? "#dc2626" : avgDiff < 0 ? "#22c55e" : "#374151",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						textAlign: "center",
					}}
				>
					<p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
						Average vs Estimated
					</p>
					<p
						style={{
							margin: "0.25rem 0",
							fontSize: "2rem",
							fontWeight: "bold",
						}}
					>
						{avgDiff > 0 ? "+" : ""}
						{avgDiff} min
					</p>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Route Stats
				</h2>
				{routeStats.map((r) => (
					<div
						key={r.route}
						style={{
							background: "#374151",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
						}}
					>
						<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
							{r.route}
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: "0.85rem",
								opacity: 0.7,
							}}
						>
							<span>Avg: {r.avg}min</span>
							<span style={{ color: "#22c55e" }}>Best: {r.best}min</span>
							<span style={{ color: "#ef4444" }}>Worst: {r.worst}min</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
