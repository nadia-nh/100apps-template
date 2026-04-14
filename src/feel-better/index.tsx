import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Entry {
	id: number;
	action: string;
	moodBefore: number;
	moodAfter: number;
	date: string;
}

export default function FeelBetter() {
	const [entries, setEntries] = useState<Entry[]>(() => {
		const saved = localStorage.getItem("feel-better");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("feel-better", JSON.stringify(entries));
	}, [entries]);

	const addEntry = (action: string, moodBefore: number, moodAfter: number) => {
		setEntries([
			{
				id: Date.now(),
				action,
				moodBefore,
				moodAfter,
				date: new Date().toISOString().split("T")[0],
			},
			...entries,
		]);
	};

	const bestActions = [...new Set(entries.map((e) => e.action))]
		.map((action) => {
			const actionEntries = entries.filter((e) => e.action === action);
			const avgImprovement =
				actionEntries.reduce((a, e) => a + (e.moodAfter - e.moodBefore), 0) /
				actionEntries.length;
			return {
				action,
				improvement: avgImprovement,
				count: actionEntries.length,
			};
		})
		.sort((a, b) => b.improvement - a.improvement)
		.slice(0, 5);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
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
					Feel Better
				</h1>
				<p style={{ textAlign: "center", opacity: 0.7, marginBottom: "2rem" }}>
					Log actions that improve how you feel
				</p>

				<AddEntryForm onAdd={addEntry} />

				{bestActions.length > 0 && (
					<div style={{ marginTop: "1.5rem" }}>
						<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
							Your Best Tools
						</h2>
						{bestActions.map((item, i) => (
							<div
								key={i}
								style={{
									background: "rgba(255,255,255,0.15)",
									borderRadius: 12,
									padding: "1rem",
									marginBottom: "0.5rem",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<span>{item.action}</span>
								<span
									style={{
										fontWeight: "bold",
										color: item.improvement > 0 ? "#ecfdf5" : "#fecaca",
									}}
								>
									+{item.improvement.toFixed(1)} avg
								</span>
							</div>
						))}
					</div>
				)}

				<h2 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
					Recent Entries
				</h2>
				{entries.slice(0, 10).map((e) => (
					<div
						key={e.id}
						style={{
							background: "rgba(255,255,255,0.1)",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.5rem",
						}}
					>
						<p style={{ margin: 0, fontWeight: "bold" }}>{e.action}</p>
						<p
							style={{
								margin: "0.25rem 0 0",
								fontSize: "0.85rem",
								opacity: 0.7,
							}}
						>
							{e.moodBefore} → {e.moodAfter} (
							{e.moodAfter - e.moodBefore > 0 ? "+" : ""}
							{e.moodAfter - e.moodBefore})
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

function AddEntryForm({
	onAdd,
}: {
	onAdd: (action: string, before: number, after: number) => void;
}) {
	const [action, setAction] = useState("");
	const [before, setBefore] = useState(5);
	const [after, setAfter] = useState(7);
	const quickActions = [
		"Exercise",
		"Meditation",
		"Walk",
		"Call friend",
		"Read",
		"Music",
		"Nature",
		"Journal",
	];
	return (
		<div
			style={{
				background: "rgba(255,255,255,0.2)",
				borderRadius: 12,
				padding: "1rem",
			}}
		>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "0.5rem",
					marginBottom: "0.75rem",
				}}
			>
				{quickActions.map((a) => (
					<button
						key={a}
						onClick={() => setAction(a)}
						style={{
							padding: "0.4rem 0.75rem",
							borderRadius: 20,
							border: "none",
							background: action === a ? "white" : "rgba(255,255,255,0.3)",
							color: action === a ? "#10b981" : "white",
							cursor: "pointer",
							fontSize: "0.85rem",
						}}
					>
						{a}
					</button>
				))}
			</div>
			<input
				type="text"
				value={action}
				onChange={(e) => setAction(e.target.value)}
				placeholder="What did you do?"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "white",
					color: "#000",
					marginBottom: "0.75rem",
				}}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "0.5rem",
				}}
			>
				<span>Mood before: {before}</span>
				<span>Mood after: {after}</span>
			</div>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
				<input
					type="range"
					min="1"
					max="10"
					value={before}
					onChange={(e) => setBefore(Number(e.target.value))}
					style={{ flex: 1, accentColor: "#fca5a5" }}
				/>
				<input
					type="range"
					min="1"
					max="10"
					value={after}
					onChange={(e) => setAfter(Number(e.target.value))}
					style={{ flex: 1, accentColor: "#6ee7b7" }}
				/>
			</div>
			<button
				onClick={() => {
					if (action) {
						onAdd(action, before, after);
						setAction("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "white",
					color: "#10b981",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Log Action
			</button>
		</div>
	);
}
