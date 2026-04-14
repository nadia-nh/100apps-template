import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DayRank {
	date: string;
	items: string[];
	completed: boolean[];
}

export default function DailyRank() {
	const [todayItems, setTodayItems] = useState<string[]>([]);
	const [newItem, setNewItem] = useState("");
	const [history, setHistory] = useState<DayRank[]>([]);

	useEffect(() => {
		const saved = localStorage.getItem("daily-rank-history");
		if (saved) setHistory(JSON.parse(saved));
	}, []);

	const add = () => {
		if (newItem.trim() && todayItems.length < 3) {
			setTodayItems([...todayItems, newItem.trim()]);
			setNewItem("");
		}
	};
	const remove = (i: number) =>
		setTodayItems(todayItems.filter((_, idx) => idx !== i));

	const save = () => {
		const completed = todayItems.map(() => false);
		const entry: DayRank = {
			date: new Date().toLocaleDateString(),
			items: todayItems,
			completed,
		};
		const updated = [entry, ...history].slice(0, 30);
		setHistory(updated);
		localStorage.setItem("daily-rank-history", JSON.stringify(updated));
		setTodayItems([]);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Daily Rank</h1>
				<p>Rank your top 3 priorities</p>
			</div>
			<div className="today-section">
				<h3>Today's Top 3</h3>
				{todayItems.length < 3 && (
					<div className="input-row">
						<input
							value={newItem}
							onChange={(e) => setNewItem(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && add()}
							placeholder={`Priority ${todayItems.length + 1}...`}
						/>
						<button onClick={add}>+</button>
					</div>
				)}
				<div className="rank-list">
					{todayItems.map((item, i) => (
						<div key={i} className="rank-item">
							<span className="rank-num">#{i + 1}</span>
							<span className="rank-text">{item}</span>
							<button onClick={() => remove(i)}>×</button>
						</div>
					))}
				</div>
				{todayItems.length > 0 && (
					<button className="save-btn" onClick={save}>
						Save & Start New Day
					</button>
				)}
			</div>
			<div className="history-section">
				<h3>History</h3>
				{history.length === 0 ? (
					<p className="empty">No entries yet</p>
				) : (
					history.map((day, i) => (
						<div key={i} className="history-day">
							<span className="date">{day.date}</span>
							<div className="history-items">
								{day.items.map((item, j) => (
									<span key={j} className="history-item">
										#{j + 1} {item}
									</span>
								))}
							</div>
						</div>
					))
				)}
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #f5af19 0%, #f12711 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.8); font-size: 0.9rem; }
        .today-section { background: rgba(255,255,255,0.15); border-radius: 1rem; padding: 1rem; margin-bottom: 1.5rem; }
        .today-section h3 { margin: 0 0 1rem; font-size: 0.9rem; color: white; }
        .input-row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
        .input-row input { flex: 1; padding: 0.7rem; background: rgba(255,255,255,0.2); border: none; border-radius: 0.5rem; color: white; }
        .input-row button { padding: 0.7rem 1rem; background: white; border: none; border-radius: 0.5rem; color: #f12711; font-weight: 600; cursor: pointer; }
        .rank-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .rank-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.2); border-radius: 0.5rem; }
        .rank-num { font-weight: 700; color: white; }
        .rank-text { flex: 1; }
        .rank-item button { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; }
        .save-btn { width: 100%; padding: 0.75rem; background: white; border: none; border-radius: 0.5rem; color: #f12711; font-weight: 600; cursor: pointer; }
        .history-section { }
        .history-section h3 { margin: 0 0 0.75rem; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
        .empty { text-align: center; opacity: 0.6; font-size: 0.9rem; }
        .history-day { background: rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.5rem; }
        .history-day .date { display: block; font-size: 0.75rem; opacity: 0.7; margin-bottom: 0.5rem; }
        .history-items { display: flex; flex-direction: column; gap: 0.25rem; }
        .history-item { font-size: 0.85rem; }
      `}</style>
		</div>
	);
}
