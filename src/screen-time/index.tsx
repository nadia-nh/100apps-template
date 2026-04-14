import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ScreenEntry {
	id: number;
	category: string;
	minutes: number;
	date: string;
}

export default function ScreenTime() {
	const [entries, setEntries] = useState<ScreenEntry[]>(() => {
		const saved = localStorage.getItem("screen-entries");
		return saved ? JSON.parse(saved) : [];
	});
	const [category, setCategory] = useState("work");
	const [minutes, setMinutes] = useState("");
	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		localStorage.setItem("screen-entries", JSON.stringify(entries));
	}, [entries]);

	const addEntry = () => {
		if (!minutes) return;
		setEntries([
			{ id: Date.now(), category, minutes: Number(minutes), date: today },
			...entries,
		]);
		setMinutes("");
	};

	const categories = [
		{ t: "work", c: "#3b82f6", icon: "💼" },
		{ t: "social", c: "#8b5cf6", icon: "📱" },
		{ t: "entertainment", c: "#ec4899", icon: "🎬" },
		{ t: "reading", c: "#10b981", icon: "📖" },
	];

	const todayEntries = entries.filter((e) => e.date === today);
	const totalToday = todayEntries.reduce((a, e) => a + e.minutes, 0);
	const byCategory = categories.map((c) => ({
		...c,
		total: todayEntries
			.filter((e) => e.category === c.t)
			.reduce((a, e) => a + e.minutes, 0),
	}));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0f172a",
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
					Screen Time
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Manual screen time log
				</p>

				<div
					style={{
						background: "#1e293b",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
					>
						{categories.map((c) => (
							<button
								key={c.t}
								onClick={() => setCategory(c.t)}
								style={{
									flex: 1,
									padding: "0.75rem",
									borderRadius: 8,
									border: "none",
									background: category === c.t ? c.c : "#334155",
									color: "white",
									cursor: "pointer",
								}}
							>
								<span style={{ fontSize: "1.2rem" }}>{c.icon}</span>
								<div
									style={{ fontSize: "0.7rem", textTransform: "capitalize" }}
								>
									{c.t}
								</div>
							</button>
						))}
					</div>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<input
							type="number"
							placeholder="Minutes"
							value={minutes}
							onChange={(e) => setMinutes(e.target.value)}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#0f172a",
								color: "white",
							}}
						/>
						<button
							onClick={addEntry}
							style={{
								padding: "0.75rem 1.5rem",
								borderRadius: 8,
								border: "none",
								background: "#3b82f6",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Log
						</button>
					</div>
				</div>

				<div
					style={{
						background: totalToday > 240 ? "#dc2626" : "#1e293b",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						textAlign: "center",
						transition: "background 0.3s",
					}}
				>
					<p style={{ margin: 0, opacity: 0.6, fontSize: "0.9rem" }}>
						Today's Total
					</p>
					<p
						style={{
							margin: "0.25rem 0",
							fontSize: "2rem",
							fontWeight: "bold",
						}}
					>
						{Math.floor(totalToday / 60)}h {totalToday % 60}m
					</p>
					{totalToday > 240 && (
						<p style={{ margin: 0, fontSize: "0.8rem", color: "#fca5a5" }}>
							⚠️ Over 4 hours
						</p>
					)}
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					By Category
				</h2>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "0.5rem",
						marginBottom: "1.5rem",
					}}
				>
					{byCategory.map((c) => (
						<div
							key={c.t}
							style={{
								background: "#1e293b",
								borderRadius: 8,
								padding: "0.75rem",
								display: "flex",
								alignItems: "center",
								gap: "0.75rem",
							}}
						>
							<span style={{ fontSize: "1.2rem" }}>{c.icon}</span>
							<span style={{ flex: 1, textTransform: "capitalize" }}>
								{c.t}
							</span>
							<span style={{ fontWeight: "bold" }}>
								{Math.floor(c.total / 60)}h {c.total % 60}m
							</span>
						</div>
					))}
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Recent
				</h2>
				{entries.slice(0, 10).map((e) => {
					const c = categories.find((cat) => cat.t === e.category);
					return (
						<div
							key={e.id}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "0.75rem",
								background: "#1e293b",
								borderRadius: 8,
								marginBottom: "0.5rem",
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
							>
								<span>{c?.icon}</span>
								<span style={{ textTransform: "capitalize" }}>
									{e.category}
								</span>
							</div>
							<span style={{ fontWeight: "bold" }}>{e.minutes}m</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
