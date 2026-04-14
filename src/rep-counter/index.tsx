import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface RepSet {
	reps: number;
	timestamp: number;
}

interface Workout {
	id: number;
	name: string;
	sets: RepSet[];
}

export default function RepCounter() {
	const [workouts, setWorkouts] = useState<Workout[]>(() => {
		const saved = localStorage.getItem("rep-workouts");
		return saved ? JSON.parse(saved) : [];
	});
	const [count, setCount] = useState(0);
	const [currentWorkout, setCurrentWorkout] = useState<RepSet[]>([]);
	const [workoutName, setWorkoutName] = useState("");
	const [resting, setResting] = useState(false);
	const [restTime, setRestTime] = useState(60);
	const [restElapsed, setRestElapsed] = useState(0);
	const restRef = useRef<number | null>(null);

	useEffect(() => {
		localStorage.setItem("rep-workouts", JSON.stringify(workouts));
	}, [workouts]);

	useEffect(() => {
		if (resting && restElapsed < restTime) {
			restRef.current = window.setInterval(
				() => setRestElapsed((e) => e + 1),
				1000,
			);
		} else if (restElapsed >= restTime && restRef.current) {
			clearInterval(restRef.current);
			setResting(false);
			setRestElapsed(0);
		}
		return () => {
			if (restRef.current) clearInterval(restRef.current);
		};
	}, [resting, restElapsed, restTime]);

	const increment = () => setCount((c) => c + 1);
	const decrement = () => setCount((c) => Math.max(0, c - 1));
	const saveSet = () => {
		if (count === 0) return;
		setCurrentWorkout([
			...currentWorkout,
			{ reps: count, timestamp: Date.now() },
		]);
		setCount(0);
		setResting(true);
		setRestElapsed(0);
	};

	const finishWorkout = () => {
		if (currentWorkout.length === 0) return;
		setWorkouts([
			{
				id: Date.now(),
				name: workoutName || `Workout ${workouts.length + 1}`,
				sets: currentWorkout,
			},
			...workouts,
		]);
		setCurrentWorkout([]);
		setWorkoutName("");
	};

	const totalReps = currentWorkout.reduce((a, s) => a + s.reps, 0);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#111827",
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
					Rep Counter
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Count your reps
				</p>

				<div
					style={{
						background: "#1f2937",
						borderRadius: 24,
						padding: "2rem",
						textAlign: "center",
						marginBottom: "1.5rem",
					}}
				>
					<button
						onClick={decrement}
						style={{
							width: 60,
							height: 60,
							borderRadius: "50%",
							border: "2px solid #374151",
							background: "transparent",
							color: "white",
							fontSize: "1.5rem",
							cursor: "pointer",
							marginRight: "1rem",
						}}
					>
						-
					</button>
					<span
						style={{
							fontSize: "5rem",
							fontWeight: "bold",
							minWidth: 150,
							display: "inline-block",
						}}
					>
						{count}
					</span>
					<button
						onClick={increment}
						style={{
							width: 60,
							height: 60,
							borderRadius: "50%",
							border: "none",
							background: "#3b82f6",
							color: "white",
							fontSize: "1.5rem",
							cursor: "pointer",
							marginLeft: "1rem",
						}}
					>
						+
					</button>

					<div style={{ marginTop: "1.5rem" }}>
						<button
							onClick={saveSet}
							disabled={count === 0 || resting}
							style={{
								padding: "0.75rem 2rem",
								borderRadius: 12,
								border: "none",
								background: count === 0 || resting ? "#374151" : "#22c55e",
								color: "white",
								fontWeight: "bold",
								cursor: count === 0 || resting ? "not-allowed" : "pointer",
								marginRight: "0.5rem",
							}}
						>
							Save Set
						</button>
						<button
							onClick={() => setCount(0)}
							style={{
								padding: "0.75rem 1rem",
								borderRadius: 12,
								border: "none",
								background: "#374151",
								color: "white",
								cursor: "pointer",
							}}
						>
							Reset
						</button>
					</div>
				</div>

				{resting && (
					<div
						style={{
							background: "#1f2937",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
							marginBottom: "1.5rem",
						}}
					>
						<p style={{ margin: 0, opacity: 0.6 }}>Rest Timer</p>
						<p
							style={{
								margin: "0.5rem 0",
								fontSize: "2rem",
								fontWeight: "bold",
							}}
						>
							{restTime - restElapsed}s
						</p>
						<input
							type="range"
							min="15"
							max="180"
							step="15"
							value={restTime}
							onChange={(e) => setRestTime(Number(e.target.value))}
							style={{ width: "100%", accentColor: "#3b82f6" }}
						/>
					</div>
				)}

				{currentWorkout.length > 0 && (
					<div
						style={{
							background: "#1f2937",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "0.75rem",
							}}
						>
							<h3 style={{ margin: 0 }}>Current Workout</h3>
							<span style={{ fontWeight: "bold", color: "#22c55e" }}>
								{totalReps} reps
							</span>
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
							{currentWorkout.map((s, i) => (
								<span
									key={i}
									style={{
										background: "#374151",
										padding: "0.25rem 0.75rem",
										borderRadius: 20,
										fontSize: "0.9rem",
									}}
								>
									Set {i + 1}: {s.reps}
								</span>
							))}
						</div>
						<input
							type="text"
							placeholder="Workout name (optional)"
							value={workoutName}
							onChange={(e) => setWorkoutName(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#111827",
								color: "white",
								marginTop: "1rem",
							}}
						/>
						<button
							onClick={finishWorkout}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#3b82f6",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
								marginTop: "0.5rem",
							}}
						>
							Finish Workout
						</button>
					</div>
				)}

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					History
				</h2>
				{workouts.slice(0, 5).map((w) => (
					<div
						key={w.id}
						style={{
							background: "#1f2937",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<span style={{ fontWeight: "bold" }}>{w.name}</span>
							<span style={{ color: "#22c55e" }}>
								{w.sets.reduce((a, s) => a + s.reps, 0)} reps
							</span>
						</div>
						<p
							style={{
								margin: "0.25rem 0 0",
								fontSize: "0.85rem",
								opacity: 0.5,
							}}
						>
							{new Date(w.id).toLocaleDateString()}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
