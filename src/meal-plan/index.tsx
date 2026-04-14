import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Meal {
	id: number;
	name: string;
	calories: number;
}

interface DayPlan {
	breakfast: Meal | null;
	lunch: Meal | null;
	dinner: Meal | null;
}

export default function MealPlan() {
	const [meals, setMeals] = useState<Meal[]>(() => {
		const saved = localStorage.getItem("meals");
		return saved ? JSON.parse(saved) : [];
	});
	const [plan, setPlan] = useState<Record<string, DayPlan>>(() => {
		const saved = localStorage.getItem("meal-plan");
		return saved ? JSON.parse(saved) : {};
	});
	const [newMeal, setNewMeal] = useState("");
	const [newCalories, setNewCalories] = useState(500);
	const [selectedSlot, setSelectedSlot] = useState<{
		day: string;
		slot: "breakfast" | "lunch" | "dinner";
	} | null>(null);

	useEffect(() => {
		localStorage.setItem("meals", JSON.stringify(meals));
		localStorage.setItem("meal-plan", JSON.stringify(plan));
	}, [meals, plan]);

	const addMeal = () => {
		if (!newMeal.trim()) return;
		setMeals([
			...meals,
			{ id: Date.now(), name: newMeal, calories: newCalories },
		]);
		setNewMeal("");
	};

	const assignMeal = (mealId: number) => {
		if (!selectedSlot) return;
		const meal = meals.find((m) => m.id === mealId);
		if (!meal) return;
		setPlan({
			...plan,
			[selectedSlot.day]: {
				...(plan[selectedSlot.day] || {
					breakfast: null,
					lunch: null,
					dinner: null,
				}),
				[selectedSlot.slot]: meal,
			},
		});
		setSelectedSlot(null);
	};

	const clearSlot = (day: string, slot: "breakfast" | "lunch" | "dinner") => {
		const current = plan[day] || { breakfast: null, lunch: null, dinner: null };
		setPlan({ ...plan, [day]: { ...current, [slot]: null } });
	};

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const slots: ("breakfast" | "lunch" | "dinner")[] = [
		"breakfast",
		"lunch",
		"dinner",
	];

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#fef3c7",
				color: "#78350f",
				padding: "1rem",
				fontFamily: "system-ui",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "0.5rem",
					left: "0.5rem",
					color: "rgba(120,53,15,0.5)",
					textDecoration: "none",
					fontSize: "0.85rem",
				}}
			>
				← Gallery
			</Link>

			<div style={{ maxWidth: 800, margin: "0 auto", paddingTop: "1.5rem" }}>
				<h1
					style={{
						fontSize: "1.5rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					Meal Plan
				</h1>
				<p
					style={{
						textAlign: "center",
						opacity: 0.5,
						marginBottom: "1rem",
						fontSize: "0.9rem",
					}}
				>
					Weekly meal planner
				</p>

				<div
					style={{
						background: "#fffbeb",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1rem",
					}}
				>
					<p
						style={{
							margin: "0 0 0.5rem",
							fontSize: "0.85rem",
							fontWeight: "bold",
						}}
					>
						Add New Meal
					</p>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<input
							type="text"
							placeholder="Meal name"
							value={newMeal}
							onChange={(e) => setNewMeal(e.target.value)}
							style={{
								flex: 1,
								padding: "0.5rem",
								borderRadius: 6,
								border: "1px solid #fcd34d",
								background: "white",
								color: "#78350f",
							}}
						/>
						<input
							type="number"
							value={newCalories}
							onChange={(e) => setNewCalories(Number(e.target.value))}
							style={{
								width: 70,
								padding: "0.5rem",
								borderRadius: 6,
								border: "1px solid #fcd34d",
								background: "white",
								color: "#78350f",
							}}
						/>
						<button
							onClick={addMeal}
							style={{
								padding: "0.5rem 1rem",
								borderRadius: 6,
								border: "none",
								background: "#f59e0b",
								color: "white",
								cursor: "pointer",
							}}
						>
							Add
						</button>
					</div>
				</div>

				<div style={{ overflowX: "auto" }}>
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							fontSize: "0.8rem",
						}}
					>
						<thead>
							<tr>
								<th style={{ padding: "0.5rem", textAlign: "left" }}></th>
								{days.map((d) => (
									<th
										key={d}
										style={{
											padding: "0.5rem",
											textAlign: "center",
											background: "#fcd34d",
											borderRadius: 4,
										}}
									>
										{d}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{slots.map((slot) => (
								<tr key={slot}>
									<td
										style={{
											padding: "0.5rem",
											textTransform: "capitalize",
											fontWeight: "bold",
											background: "#fef3c7",
										}}
									>
										{slot}
									</td>
									{days.map((day) => {
										const meal = plan[day]?.[slot];
										return (
											<td
												key={day + slot}
												style={{
													padding: "0.25rem",
													border: "1px solid #fcd34d",
												}}
											>
												{meal ? (
													<div
														style={{
															background: "#fef3c7",
															padding: "0.25rem",
															borderRadius: 4,
															fontSize: "0.7rem",
														}}
													>
														<div>{meal.name}</div>
														<div style={{ opacity: 0.6 }}>{meal.calories}</div>
														<button
															onClick={() => clearSlot(day, slot)}
															style={{
																background: "none",
																border: "none",
																color: "#ef4444",
																cursor: "pointer",
																fontSize: "0.6rem",
															}}
														>
															×
														</button>
													</div>
												) : (
													<button
														onClick={() => setSelectedSlot({ day, slot })}
														style={{
															width: "100%",
															padding: "0.5rem",
															border: "1px dashed #fcd34d",
															background: "transparent",
															color: "#f59e0b",
															cursor: "pointer",
															borderRadius: 4,
														}}
													>
														+
													</button>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{selectedSlot && (
					<div
						style={{
							position: "fixed",
							inset: 0,
							background: "rgba(0,0,0,0.5)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 100,
						}}
						onClick={() => setSelectedSlot(null)}
					>
						<div
							style={{
								background: "white",
								borderRadius: 12,
								padding: "1rem",
								maxWidth: 300,
								maxHeight: "70vh",
								overflow: "auto",
							}}
							onClick={(e) => e.stopPropagation()}
						>
							<h3 style={{ margin: "0 0 1rem" }}>
								Select {selectedSlot.slot} for {selectedSlot.day}
							</h3>
							{meals.map((m) => (
								<button
									key={m.id}
									onClick={() => assignMeal(m.id)}
									style={{
										width: "100%",
										padding: "0.75rem",
										borderRadius: 8,
										border: "1px solid #fcd34d",
										background: "white",
										color: "#78350f",
										marginBottom: "0.5rem",
										cursor: "pointer",
										textAlign: "left",
									}}
								>
									<div>{m.name}</div>
									<div style={{ fontSize: "0.8rem", opacity: 0.6 }}>
										{m.calories} cal
									</div>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
