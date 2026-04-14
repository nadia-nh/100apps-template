import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FoodItem {
	name: string;
	calories: number;
}

const commonFoods: FoodItem[] = [
	{ name: "Apple", calories: 95 },
	{ name: "Banana", calories: 105 },
	{ name: "Rice (1 cup)", calories: 205 },
	{ name: "Bread (slice)", calories: 80 },
	{ name: "Egg", calories: 70 },
	{ name: "Chicken breast (4oz)", calories: 165 },
	{ name: "Salad (bowl)", calories: 150 },
	{ name: "Pizza (slice)", calories: 285 },
	{ name: "Burger", calories: 550 },
	{ name: "Pasta (1 cup)", calories: 220 },
	{ name: "Milk (1 cup)", calories: 150 },
	{ name: "Yogurt (cup)", calories: 150 },
	{ name: "Steak (4oz)", calories: 270 },
	{ name: "Sandwich", calories: 400 },
	{ name: "Soup (bowl)", calories: 100 },
	{ name: "Fries (medium)", calories: 365 },
	{ name: "Cookie", calories: 160 },
	{ name: "Coffee (black)", calories: 2 },
	{ name: "Soda (can)", calories: 140 },
	{ name: "Orange", calories: 65 },
];

export default function CalorieRough() {
	const [todayLog, setTodayLog] = useState<
		{ name: string; calories: number }[]
	>(() => {
		const saved = localStorage.getItem("calorie-log");
		return saved ? JSON.parse(saved) : [];
	});
	const [goal, setGoal] = useState(() => {
		const saved = localStorage.getItem("calorie-goal");
		return saved ? Number(saved) : 2000;
	});
	const [showAdd, setShowAdd] = useState(false);
	const [customName, setCustomName] = useState("");
	const [customCals, setCustomCals] = useState(200);

	useEffect(() => {
		localStorage.setItem("calorie-log", JSON.stringify(todayLog));
		localStorage.setItem("calorie-goal", String(goal));
	}, [todayLog, goal]);

	const addFood = (name: string, calories: number) => {
		setTodayLog([...todayLog, { name, calories }]);
		setShowAdd(false);
	};

	const removeFood = (i: number) => {
		setTodayLog(todayLog.filter((_, idx) => idx !== i));
	};

	const total = todayLog.reduce((a, b) => a + b.calories, 0);
	const remaining = goal - total;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#ecfdf5",
				color: "#064e3b",
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
					color: "rgba(6,78,59,0.5)",
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
					Calorie Rough
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Quick calorie estimator
				</p>

				<div
					style={{
						background: "white",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
						boxShadow: "0 4px 15px rgba(6,78,59,0.1)",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "0.5rem",
						}}
					>
						<span style={{ opacity: 0.6 }}>Today</span>
						<span style={{ fontWeight: "bold" }}>{total} cal</span>
					</div>
					<div
						style={{
							height: 12,
							background: "#d1fae5",
							borderRadius: 6,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								height: "100%",
								width: `${Math.min(100, (total / goal) * 100)}%`,
								background: total > goal ? "#ef4444" : "#10b981",
								transition: "width 0.3s",
							}}
						/>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "0.5rem",
							fontSize: "0.85rem",
						}}
					>
						<span>Goal: {goal}</span>
						<span style={{ color: remaining < 0 ? "#ef4444" : "#10b981" }}>
							{remaining > 0
								? `${remaining} left`
								: `${Math.abs(remaining)} over`}
						</span>
					</div>
				</div>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "none",
						background: "#10b981",
						color: "white",
						fontWeight: "bold",
						cursor: "pointer",
						marginBottom: "1rem",
					}}
				>
					+ Add Food
				</button>

				{showAdd && (
					<div
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1rem",
						}}
					>
						<p
							style={{
								margin: "0 0 0.75rem",
								fontSize: "0.9rem",
								fontWeight: "bold",
							}}
						>
							Quick Add
						</p>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
							{commonFoods.slice(0, 12).map((f) => (
								<button
									key={f.name}
									onClick={() => addFood(f.name, f.calories)}
									style={{
										padding: "0.4rem 0.75rem",
										borderRadius: 20,
										border: "1px solid #a7f3d0",
										background: "white",
										color: "#064e3b",
										cursor: "pointer",
										fontSize: "0.8rem",
									}}
								>
									{f.name}
								</button>
							))}
						</div>
						<hr
							style={{
								border: "none",
								borderTop: "1px solid #d1fae5",
								margin: "1rem 0",
							}}
						/>
						<p
							style={{
								margin: "0 0 0.75rem",
								fontSize: "0.9rem",
								fontWeight: "bold",
							}}
						>
							Custom
						</p>
						<div style={{ display: "flex", gap: "0.5rem" }}>
							<input
								type="text"
								placeholder="Food"
								value={customName}
								onChange={(e) => setCustomName(e.target.value)}
								style={{
									flex: 1,
									padding: "0.5rem",
									borderRadius: 6,
									border: "1px solid #d1fae5",
									background: "white",
									color: "#064e3b",
								}}
							/>
							<input
								type="number"
								value={customCals}
								onChange={(e) => setCustomCals(Number(e.target.value))}
								style={{
									width: 70,
									padding: "0.5rem",
									borderRadius: 6,
									border: "1px solid #d1fae5",
									background: "white",
									color: "#064e3b",
								}}
							/>
							<button
								onClick={() => addFood(customName, customCals)}
								style={{
									padding: "0.5rem 1rem",
									borderRadius: 6,
									border: "none",
									background: "#10b981",
									color: "white",
									cursor: "pointer",
								}}
							>
								Add
							</button>
						</div>
					</div>
				)}

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Today's Food
				</h2>
				{todayLog.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No food logged</p>
				)}

				{todayLog.map((f, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "0.75rem",
							background: "white",
							borderRadius: 8,
							marginBottom: "0.5rem",
						}}
					>
						<span>{f.name}</span>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<span style={{ fontWeight: "bold" }}>{f.calories}</span>
							<button
								onClick={() => removeFood(i)}
								style={{
									background: "none",
									border: "none",
									color: "#ef4444",
									cursor: "pointer",
									fontSize: "1rem",
								}}
							>
								×
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
