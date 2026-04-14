import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Trigger {
	id: number;
	habit: string;
	trigger: string;
	time?: string;
	location?: string;
	mood?: string;
}

export default function TriggerTrack() {
	const [triggers, setTriggers] = useState<Trigger[]>(() => {
		const saved = localStorage.getItem("triggers");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("triggers", JSON.stringify(triggers));
	}, [triggers]);

	const addTrigger = (
		habit: string,
		trigger: string,
		time: string,
		location: string,
		mood: string,
	) => {
		setTriggers([
			...triggers,
			{ id: Date.now(), habit, trigger, time, location, mood },
		]);
	};

	const deleteTrigger = (id: number) =>
		setTriggers(triggers.filter((t) => t.id !== id));

	const timeGroups = [...new Set(triggers.map((t) => t.time).filter(Boolean))];
	const locationGroups = [
		...new Set(triggers.map((t) => t.location).filter(Boolean)),
	];
	const moodGroups = [...new Set(triggers.map((t) => t.mood).filter(Boolean))];

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#fff1f2",
				color: "#1f2937",
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
					color: "rgba(31,41,55,0.5)",
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
					Trigger Track
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Identify what precedes your habits
				</p>

				<AddTriggerForm onAdd={addTrigger} />

				{triggers.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, marginTop: "1.5rem" }}>
						No triggers logged
					</p>
				)}

				{timeGroups.length > 0 && (
					<div style={{ marginTop: "1.5rem" }}>
						<h3 style={{ opacity: 0.7, marginBottom: "0.5rem" }}>By Time</h3>
						{timeGroups.map((t) => (
							<div
								key={t}
								style={{
									background: "white",
									borderRadius: 8,
									padding: "0.75rem",
									marginBottom: "0.5rem",
								}}
							>
								{t}:{" "}
								{triggers
									.filter((x) => x.time === t)
									.map((x) => x.habit)
									.join(", ")}
							</div>
						))}
					</div>
				)}

				{locationGroups.length > 0 && (
					<div style={{ marginTop: "1.5rem" }}>
						<h3 style={{ opacity: 0.7, marginBottom: "0.5rem" }}>
							By Location
						</h3>
						{locationGroups.map((l) => (
							<div
								key={l}
								style={{
									background: "white",
									borderRadius: 8,
									padding: "0.75rem",
									marginBottom: "0.5rem",
								}}
							>
								{l}:{" "}
								{triggers
									.filter((x) => x.location === l)
									.map((x) => x.habit)
									.join(", ")}
							</div>
						))}
					</div>
				)}

				<h2 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
					All Triggers
				</h2>
				{triggers.map((t) => (
					<div
						key={t.id}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<p style={{ margin: 0, fontWeight: "bold" }}>{t.habit}</p>
								<p
									style={{
										margin: "0.25rem 0 0",
										fontSize: "0.85rem",
										opacity: 0.6,
									}}
								>
									Trigger: {t.trigger}
								</p>
							</div>
							<button
								onClick={() => deleteTrigger(t.id)}
								style={{
									background: "none",
									border: "none",
									color: "#ef4444",
									cursor: "pointer",
								}}
							>
								×
							</button>
						</div>
						<div
							style={{
								display: "flex",
								gap: "0.5rem",
								marginTop: "0.5rem",
								fontSize: "0.8rem",
								opacity: 0.7,
							}}
						>
							{t.time && <span>🕐 {t.time}</span>}
							{t.location && <span>📍 {t.location}</span>}
							{t.mood && <span>😊 {t.mood}</span>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function AddTriggerForm({
	onAdd,
}: {
	onAdd: (
		habit: string,
		trigger: string,
		time: string,
		location: string,
		mood: string,
	) => void;
}) {
	const [habit, setHabit] = useState("");
	const [trigger, setTrigger] = useState("");
	const [time, setTime] = useState("");
	const [location, setLocation] = useState("");
	const [mood, setMood] = useState("");
	return (
		<div
			style={{
				background: "white",
				borderRadius: 12,
				padding: "1rem",
				boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
			}}
		>
			<input
				type="text"
				value={habit}
				onChange={(e) => setHabit(e.target.value)}
				placeholder="Habit (e.g., check phone)"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #fce7f3",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="text"
				value={trigger}
				onChange={(e) => setTrigger(e.target.value)}
				placeholder="What triggered it?"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #fce7f3",
					marginBottom: "0.5rem",
				}}
			/>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
				<input
					type="text"
					value={time}
					onChange={(e) => setTime(e.target.value)}
					placeholder="Time (e.g., morning)"
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "1px solid #fce7f3",
					}}
				/>
				<input
					type="text"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					placeholder="Location"
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "1px solid #fce7f3",
					}}
				/>
			</div>
			<button
				onClick={() => {
					if (habit && trigger) {
						onAdd(habit, trigger, time, location, mood);
						setHabit("");
						setTrigger("");
						setTime("");
						setLocation("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#ec4899",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Log Trigger
			</button>
		</div>
	);
}
