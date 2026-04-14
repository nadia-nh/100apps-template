import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Workout {
	id: number;
	type: "walk" | "run" | "bike" | "swim";
	distance: number;
	duration: number;
	date: string;
}

export default function DistanceLog() {
	const [workouts, setWorkouts] = useState<Workout[]>(() => {
		const saved = localStorage.getItem("distance-log");
		return saved ? JSON.parse(saved) : [];
	});
	const [newWorkout, setNewWorkout] = useState<{
		type: "walk" | "run" | "bike" | "swim";
		distance: string;
		duration: string;
	}>({
		type: "run",
		distance: "",
		duration: "",
	});

	useEffect(() => {
		localStorage.setItem("distance-log", JSON.stringify(workouts));
	}, [workouts]);

	const addWorkout = () => {
		if (!newWorkout.distance || !newWorkout.duration) return;
		setWorkouts([
			{
				id: Date.now(),
				type: newWorkout.type,
				distance: Number(newWorkout.distance),
				duration: Number(newWorkout.duration),
				date: new Date().toISOString().split("T")[0],
			},
			...workouts,
		]);
		setNewWorkout({ type: "run", distance: "", duration: "" });
	};

	const deleteWorkout = (id: number) => {
		setWorkouts(workouts.filter((w) => w.id !== id));
	};

	const types = [
		{ t: "walk", c: "#22c55e", icon: "🚶" },
		{ t: "run", c: "#3b82f6", icon: "🏃" },
		{ t: "bike", c: "#f59e0b", icon: "🚴" },
		{ t: "swim", c: "#06b6d4", icon: "🏊" },
	] as const;

	const weekWorkouts = workouts.filter((w) => {
		const d = new Date(w.date);
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return d >= weekAgo;
	});
	const weekTotal = weekWorkouts.reduce((a, w) => a + w.distance, 0);

	const getPace = (distance: number, duration: number) => {
		if (!distance) return 0;
		return (duration / 60 / distance).toFixed(2);
	};

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
					Distance Log
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track your workouts
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
						{types.map((ty) => (
							<button
								key={ty.t}
								onClick={() => setNewWorkout({ ...newWorkout, type: ty.t })}
								style={{
									flex: 1,
									padding: "0.75rem",
									borderRadius: 8,
									border: "none",
									background: newWorkout.type === ty.t ? ty.c : "#334155",
									color: "white",
									cursor: "pointer",
								}}
							>
								<span style={{ fontSize: "1.2rem" }}>{ty.icon}</span>
								<div
									style={{ fontSize: "0.7rem", textTransform: "capitalize" }}
								>
									{ty.t}
								</div>
							</button>
						))}
					</div>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<input
							type="number"
							placeholder="Distance (km)"
							value={newWorkout.distance}
							onChange={(e) =>
								setNewWorkout({ ...newWorkout, distance: e.target.value })
							}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#0f172a",
								color: "white",
							}}
						/>
						<input
							type="number"
							placeholder="Duration (min)"
							value={newWorkout.duration}
							onChange={(e) =>
								setNewWorkout({ ...newWorkout, duration: e.target.value })
							}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#0f172a",
								color: "white",
							}}
						/>
					</div>
					<button
						onClick={addWorkout}
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
						Log Workout
					</button>
				</div>

				<div
					style={{
						background: "#1e293b",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<p style={{ margin: 0, opacity: 0.6, fontSize: "0.9rem" }}>
						This Week
					</p>
					<p
						style={{
							margin: "0.5rem 0 0",
							fontSize: "2rem",
							fontWeight: "bold",
						}}
					>
						{weekTotal.toFixed(1)} km
					</p>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Recent Workouts
				</h2>
				{workouts.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No workouts yet</p>
				)}

				{workouts.slice(0, 10).map((w) => {
					const ty = types.find((t) => t.t === w.type)!;
					return (
						<div
							key={w.id}
							style={{
								background: "#1e293b",
								borderRadius: 12,
								padding: "1rem",
								marginBottom: "0.75rem",
								borderLeft: `4px solid ${ty.c}`,
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.75rem",
									}}
								>
									<span style={{ fontSize: "1.5rem" }}>{ty.icon}</span>
									<div>
										<p
											style={{
												margin: 0,
												fontWeight: "bold",
												textTransform: "capitalize",
											}}
										>
											{w.type}
										</p>
										<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.5 }}>
											{w.date}
										</p>
									</div>
								</div>
								<button
									onClick={() => deleteWorkout(w.id)}
									style={{
										background: "transparent",
										border: "none",
										color: "rgba(255,255,255,0.3)",
										cursor: "pointer",
									}}
								>
									×
								</button>
							</div>
							<div
								style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}
							>
								<div>
									<span style={{ opacity: 0.5 }}>Distance</span>
									<p style={{ margin: 0, fontWeight: "bold" }}>
										{w.distance} km
									</p>
								</div>
								<div>
									<span style={{ opacity: 0.5 }}>Duration</span>
									<p style={{ margin: 0, fontWeight: "bold" }}>
										{w.duration} min
									</p>
								</div>
								<div>
									<span style={{ opacity: 0.5 }}>Pace</span>
									<p style={{ margin: 0, fontWeight: "bold" }}>
										{getPace(w.distance, w.duration)} /km
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
