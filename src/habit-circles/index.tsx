import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Habit {
	id: string;
	name: string;
	color: string;
	completions: Record<string, boolean>;
}

const colors = [
	"#ff6b6b",
	"#feca57",
	"#48dbfb",
	"#ff9ff3",
	"#54a0ff",
	"#5f27cd",
	"#00d2d3",
	"#10ac84",
	"#ee5a24",
	"#a29bfe",
];

export default function HabitCircles() {
	const [habits, setHabits] = useState<Habit[]>(() => {
		const saved = localStorage.getItem("habit-circles");
		return saved
			? JSON.parse(saved)
			: [
					{ id: "1", name: "Exercise", color: "#ff6b6b", completions: {} },
					{ id: "2", name: "Read", color: "#48dbfb", completions: {} },
					{ id: "3", name: "Meditate", color: "#10ac84", completions: {} },
				];
	});
	const [newHabitName, setNewHabitName] = useState("");
	const [selectedColor, setSelectedColor] = useState(colors[0]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [viewingHabit, setViewingHabit] = useState<Habit | null>(null);

	useEffect(() => {
		localStorage.setItem("habit-circles", JSON.stringify(habits));
	}, [habits]);

	const today = new Date();
	const weekStart = new Date(today);
	weekStart.setDate(today.getDate() - today.getDay());

	const getWeekDates = () => {
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(weekStart);
			d.setDate(weekStart.getDate() + i);
			return d;
		});
	};

	const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

	const weekDates = getWeekDates();

	const toggleCompletion = (habitId: string, dateKey: string) => {
		setHabits(
			habits.map((h) => {
				if (h.id === habitId) {
					return {
						...h,
						completions: {
							...h.completions,
							[dateKey]: !h.completions[dateKey],
						},
					};
				}
				return h;
			}),
		);
	};

	const addHabit = () => {
		if (newHabitName.trim()) {
			const newHabit: Habit = {
				id: Date.now().toString(),
				name: newHabitName.trim(),
				color: selectedColor,
				completions: {},
			};
			setHabits([...habits, newHabit]);
			setNewHabitName("");
			setShowAddForm(false);
		}
	};

	const deleteHabit = (id: string) => {
		setHabits(habits.filter((h) => h.id !== id));
		setViewingHabit(null);
	};

	const getStreak = (habit: Habit) => {
		let streak = 0;
		const d = new Date();
		while (true) {
			const key = formatDateKey(d);
			if (habit.completions[key]) {
				streak++;
				d.setDate(d.getDate() - 1);
			} else {
				break;
			}
		}
		return streak;
	};

	const getMonthData = (habit: Habit) => {
		const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
		const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		const days = [];
		for (
			let d = new Date(monthStart);
			d <= monthEnd;
			d.setDate(d.getDate() + 1)
		) {
			days.push({
				date: new Date(d),
				key: formatDateKey(d),
				completed: habit.completions[formatDateKey(d)],
			});
		}
		return days;
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Habit Circles</h1>
				<p>Tap to complete • Long press for details</p>
			</div>

			<div className="week-view">
				<div className="week-labels">
					{weekDates.map((d, i) => (
						<div
							key={i}
							className={`day-label ${formatDateKey(d) === formatDateKey(today) ? "today" : ""}`}
						>
							{d.toLocaleDateString("en-US", { weekday: "short" })}
						</div>
					))}
				</div>

				<div className="habits-grid">
					{habits.map((habit) => (
						<div key={habit.id} className="habit-row">
							<div className="habit-name">{habit.name}</div>
							<div className="circles-row">
								{weekDates.map((d, i) => {
									const dateKey = formatDateKey(d);
									const isCompleted = habit.completions[dateKey];
									const isToday = formatDateKey(d) === formatDateKey(today);
									return (
										<button
											key={i}
											className={`circle ${isCompleted ? "completed" : ""} ${isToday ? "today" : ""}`}
											style={
												{ "--habit-color": habit.color } as React.CSSProperties
											}
											onClick={() => toggleCompletion(habit.id, dateKey)}
											onContextMenu={(e) => {
												e.preventDefault();
												setViewingHabit(habit);
											}}
										>
											{isCompleted && <span className="check">✓</span>}
										</button>
									);
								})}
							</div>
							<div className="streak-badge" style={{ background: habit.color }}>
								{getStreak(habit)}🔥
							</div>
						</div>
					))}
				</div>
			</div>

			<button
				className="add-habit-btn"
				onClick={() => setShowAddForm(!showAddForm)}
			>
				{showAddForm ? "×" : "+ Add Habit"}
			</button>

			{showAddForm && (
				<div className="add-form">
					<input
						type="text"
						placeholder="Habit name..."
						value={newHabitName}
						onChange={(e) => setNewHabitName(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && addHabit()}
						autoFocus
					/>
					<div className="color-picker">
						{colors.map((color) => (
							<button
								key={color}
								className={`color-option ${selectedColor === color ? "selected" : ""}`}
								style={{ background: color }}
								onClick={() => setSelectedColor(color)}
							/>
						))}
					</div>
					<button className="save-btn" onClick={addHabit}>
						Save Habit
					</button>
				</div>
			)}

			{viewingHabit && (
				<div className="detail-modal">
					<div className="modal-content">
						<button
							className="close-modal"
							onClick={() => setViewingHabit(null)}
						>
							×
						</button>
						<h2 style={{ color: viewingHabit.color }}>{viewingHabit.name}</h2>

						<div className="streak-display">
							<span className="streak-number">{getStreak(viewingHabit)}</span>
							<span className="streak-label">day streak</span>
						</div>

						<div className="month-grid">
							{getMonthData(viewingHabit).map((day, i) => (
								<div
									key={i}
									className={`month-day ${day.completed ? "completed" : ""} ${formatDateKey(day.date) === formatDateKey(today) ? "today" : ""}`}
									style={
										{
											"--habit-color": viewingHabit.color,
										} as React.CSSProperties
									}
									title={day.date.toLocaleDateString()}
								/>
							))}
						</div>

						<button
							className="delete-habit"
							onClick={() => deleteHabit(viewingHabit.id)}
						>
							Delete Habit
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #0f0f0f;
          color: #f0f0f0;
          padding: 1.5rem;
          font-family: 'Space Grotesk', system-ui, sans-serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 0.85rem;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header p {
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .week-view {
          background: rgba(255,255,255,0.03);
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .week-labels {
          display: grid;
          grid-template-columns: 60px repeat(7, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .day-label {
          text-align: center;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .day-label.today {
          color: #fff;
          font-weight: 700;
        }

        .habits-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .habit-row {
          display: grid;
          grid-template-columns: 60px 1fr auto;
          align-items: center;
          gap: 0.75rem;
        }

        .habit-name {
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .circles-row {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
        }

        .circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
        }

        .circle.today {
          border-color: rgba(255,255,255,0.5);
        }

        .circle.completed {
          background: var(--habit-color);
          border-color: var(--habit-color);
        }

        .circle:hover {
          transform: scale(1.1);
        }

        .check {
          color: white;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .streak-badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 1rem;
          color: white;
          font-weight: 600;
          min-width: 32px;
          text-align: center;
        }

        .add-habit-btn {
          width: 100%;
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border: 2px dashed rgba(255,255,255,0.15);
          border-radius: 1rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-habit-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.8);
        }

        .add-form {
          background: rgba(255,255,255,0.05);
          border-radius: 1rem;
          padding: 1rem;
          margin-top: 1rem;
        }

        .add-form input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 0.75rem;
          padding: 0.8rem 1rem;
          color: white;
          font-size: 1rem;
          margin-bottom: 1rem;
          box-sizing: border-box;
        }

        .add-form input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .color-picker {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-option.selected {
          border-color: white;
          transform: scale(1.15);
        }

        .save-btn {
          width: 100%;
          padding: 0.8rem;
          background: white;
          color: black;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover {
          transform: translateY(-2px);
        }

        .detail-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          background: #1a1a1a;
          border-radius: 1.5rem;
          padding: 2rem;
          width: 100%;
          max-width: 360px;
          position: relative;
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-content h2 {
          text-align: center;
          font-size: 1.5rem;
          margin: 0 0 1.5rem;
        }

        .streak-display {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .streak-number {
          display: block;
          font-size: 3rem;
          font-weight: 700;
        }

        .streak-label {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        .month-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 1.5rem;
        }

        .month-day {
          aspect-ratio: 1;
          border-radius: 4px;
          background: rgba(255,255,255,0.08);
        }

        .month-day.completed {
          background: var(--habit-color);
        }

        .month-day.today {
          border: 2px solid white;
        }

        .delete-habit {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255, 82, 82, 0.15);
          border: 1px solid #ff5252;
          color: #ff5252;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .delete-habit:hover {
          background: #ff5252;
          color: white;
        }
      `}</style>
		</div>
	);
}
