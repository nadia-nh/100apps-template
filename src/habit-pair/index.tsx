import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HabitPair {
	id: number;
	trigger: string;
	habit: string;
	completedToday: boolean;
}

export default function HabitPair() {
	const [pairs, setPairs] = useState<HabitPair[]>(() => {
		const saved = localStorage.getItem("habit-pairs");
		return saved ? JSON.parse(saved) : [];
	});
	const today = new Date().toISOString().split("T")[0];
	const [history, setHistory] = useState<Record<string, boolean>>(() => {
		const saved = localStorage.getItem("habit-pair-history");
		return saved ? JSON.parse(saved) : {};
	});

	useEffect(() => {
		localStorage.setItem("habit-pairs", JSON.stringify(pairs));
		localStorage.setItem("habit-pair-history", JSON.stringify(history));
	}, [pairs, history]);

	const addPair = (trigger: string, habit: string) =>
		setPairs([
			...pairs,
			{ id: Date.now(), trigger, habit, completedToday: false },
		]);
	const toggle = (id: number) => {
		const pair = pairs.find((p) => p.id === id);
		if (!pair) return;
		setPairs(
			pairs.map((p) =>
				p.id === id ? { ...p, completedToday: !p.completedToday } : p,
			),
		);
		setHistory({ ...history, [`${pair.id}-${today}`]: !pair.completedToday });
	};

	const trigger = (id: number) => {
		setPairs(
			pairs.map((p) => (p.id === id ? { ...p, completedToday: true } : p)),
		);
		setHistory({ ...history, [`${id}-${today}`]: true });
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
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
					Habit Pair
				</h1>
				<p style={{ textAlign: "center", opacity: 0.7, marginBottom: "2rem" }}>
					After I do X, I will do Y
				</p>

				<AddPairForm onAdd={addPair} />

				{pairs.map((pair) => (
					<div
						key={pair.id}
						style={{
							background: pair.completedToday
								? "rgba(255,255,255,0.2)"
								: "rgba(255,255,255,0.1)",
							borderRadius: 16,
							padding: "1.5rem",
							marginBottom: "1rem",
							borderLeft: pair.completedToday
								? "4px solid #22d3ee"
								: "4px solid transparent",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
								marginBottom: "0.75rem",
							}}
						>
							<span
								style={{
									background: "#fbbf24",
									color: "#000",
									padding: "0.25rem 0.5rem",
									borderRadius: 4,
									fontSize: "0.8rem",
									fontWeight: "bold",
								}}
							>
								AFTER
							</span>
							<span style={{ fontSize: "1.1rem" }}>{pair.trigger}</span>
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
								marginBottom: "1rem",
							}}
						>
							<span
								style={{
									background: "#22d3ee",
									color: "#000",
									padding: "0.25rem 0.5rem",
									borderRadius: 4,
									fontSize: "0.8rem",
									fontWeight: "bold",
								}}
							>
								WILL DO
							</span>
							<span style={{ fontSize: "1.1rem" }}>{pair.habit}</span>
						</div>
						<div style={{ display: "flex", gap: "0.5rem" }}>
							<button
								onClick={() => trigger(pair.id)}
								style={{
									flex: 1,
									padding: "0.75rem",
									borderRadius: 8,
									border: "none",
									background: "#fbbf24",
									color: "#000",
									fontWeight: "bold",
									cursor: "pointer",
								}}
							>
								Trigger
							</button>
							<button
								onClick={() => toggle(pair.id)}
								style={{
									padding: "0.75rem 1.5rem",
									borderRadius: 8,
									border: "none",
									background: pair.completedToday
										? "#22c55e"
										: "rgba(255,255,255,0.2)",
									color: "white",
									cursor: "pointer",
								}}
							>
								{pair.completedToday ? "✓ Done" : "Mark Done"}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function AddPairForm({
	onAdd,
}: {
	onAdd: (trigger: string, habit: string) => void;
}) {
	const [trigger, setTrigger] = useState("");
	const [habit, setHabit] = useState("");
	return (
		<div
			style={{
				background: "rgba(255,255,255,0.15)",
				borderRadius: 12,
				padding: "1rem",
				marginBottom: "1.5rem",
			}}
		>
			<input
				type="text"
				value={trigger}
				onChange={(e) => setTrigger(e.target.value)}
				placeholder="After I..."
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "rgba(255,255,255,0.9)",
					color: "#000",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="text"
				value={habit}
				onChange={(e) => setHabit(e.target.value)}
				placeholder="I will..."
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "rgba(255,255,255,0.9)",
					color: "#000",
					marginBottom: "0.75rem",
				}}
			/>
			<button
				onClick={() => {
					if (trigger && habit) {
						onAdd(trigger, habit);
						setTrigger("");
						setHabit("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#fff",
					color: "#0891b2",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Add Pair
			</button>
		</div>
	);
}
