import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface MoodEntry {
	id: string;
	color: string;
	label: string;
	timestamp: Date;
	note?: string;
}

const moodColors = [
	{ color: "#ff6b6b", label: "Angry" },
	{ color: "#ffa502", label: "Frustrated" },
	{ color: "#fed330", label: "Anxious" },
	{ color: "#a55eea", label: "Sad" },
	{ color: "#26de81", label: "Calm" },
	{ color: "#2d98da", label: "Content" },
	{ color: "#20bf6b", label: "Happy" },
	{ color: "#eb3b5a", label: "Excited" },
	{ color: "#fa8231", label: "Energetic" },
	{ color: "#fc5c65", label: "Loved" },
	{ color: "#4b7bec", label: "Relaxed" },
	{ color: "#a55eea", label: "Thoughtful" },
];

export default function ColorMood() {
	const [entries, setEntries] = useState<MoodEntry[]>(() => {
		const saved = localStorage.getItem("color-mood-entries");
		return saved ? JSON.parse(saved) : [];
	});
	const [selectedMood, setSelectedMood] = useState<
		(typeof moodColors)[0] | null
	>(null);
	const [note, setNote] = useState("");
	const [viewingDate, setViewingDate] = useState<string | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);

	useEffect(() => {
		localStorage.setItem("color-mood-entries", JSON.stringify(entries));
	}, [entries]);

	const today = new Date();
	const todayKey = today.toISOString().split("T")[0];

	const todayEntry = entries.find(
		(e) => new Date(e.timestamp).toISOString().split("T")[0] === todayKey,
	);

	const logMood = () => {
		if (!selectedMood) return;
		const newEntry: MoodEntry = {
			id: Date.now().toString(),
			color: selectedMood.color,
			label: selectedMood.label,
			timestamp: new Date(),
			note: note.trim() || undefined,
		};
		setEntries([newEntry, ...entries]);
		setSelectedMood(null);
		setNote("");
	};

	const getMonthData = () => {
		const year = today.getFullYear();
		const month = today.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days = [];

		for (let i = 0; i < firstDay.getDay(); i++) {
			days.push(null);
		}

		for (let d = 1; d <= lastDay.getDate(); d++) {
			const dateKey = new Date(year, month, d).toISOString().split("T")[0];
			const entry = entries.find(
				(e) => new Date(e.timestamp).toISOString().split("T")[0] === dateKey,
			);
			days.push({ date: new Date(year, month, d), entry });
		}

		return days;
	};

	const getDominantMoods = () => {
		const last30 = entries.filter((e) => {
			const diff = Date.now() - new Date(e.timestamp).getTime();
			return diff < 30 * 24 * 60 * 60 * 1000;
		});

		const counts: Record<string, number> = {};
		last30.forEach((e) => {
			counts[e.label] = (counts[e.label] || 0) + 1;
		});

		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Color Mood</h1>
				<p>How are you feeling?</p>
			</div>

			<div className="today-section">
				{todayEntry ? (
					<div className="today-mood" style={{ background: todayEntry.color }}>
						<span className="mood-label">{todayEntry.label}</span>
						{todayEntry.note && <p className="mood-note">{todayEntry.note}</p>}
						<span className="mood-time">
							{new Date(todayEntry.timestamp).toLocaleTimeString("en-US", {
								hour: "numeric",
								minute: "2-digit",
							})}
						</span>
					</div>
				) : (
					<div className="mood-picker">
						<div className="color-grid">
							{moodColors.map((mood) => (
								<button
									key={mood.label}
									className={`mood-btn ${selectedMood?.label === mood.label ? "selected" : ""}`}
									style={{ background: mood.color }}
									onClick={() => setSelectedMood(mood)}
								>
									{selectedMood?.label === mood.label && <span>✓</span>}
								</button>
							))}
						</div>

						{selectedMood && (
							<div className="mood-form">
								<p className="selected-label">Feeling {selectedMood.label}</p>
								<textarea
									placeholder="Add a note (optional)..."
									value={note}
									onChange={(e) => setNote(e.target.value)}
								/>
								<button className="log-btn" onClick={logMood}>
									Log Mood
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="stats-row">
				<button
					className="stat-btn"
					onClick={() => setShowCalendar(!showCalendar)}
				>
					<span className="stat-icon">📅</span>
					<span className="stat-label">Calendar</span>
				</button>
				<div className="stat-item">
					<span className="stat-value">{entries.length}</span>
					<span className="stat-label">Total Logs</span>
				</div>
			</div>

			{showCalendar && (
				<div className="calendar-section">
					<div className="calendar-header">
						<h3>
							{today.toLocaleDateString("en-US", {
								month: "long",
								year: "numeric",
							})}
						</h3>
					</div>
					<div className="calendar-grid">
						{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
							<div key={i} className="day-name">
								{d}
							</div>
						))}
						{getMonthData().map((item, i) => (
							<div
								key={i}
								className={`calendar-day ${item ? (item.entry ? "has-entry" : "empty") : "hidden"}`}
								style={item?.entry ? { background: item.entry.color } : {}}
								onClick={() =>
									item?.entry &&
									setViewingDate(new Date(item.date).toISOString())
								}
							>
								{item?.date.getDate()}
							</div>
						))}
					</div>
				</div>
			)}

			{getDominantMoods().length > 0 && (
				<div className="insights-section">
					<h3>This Month's Moods</h3>
					<div className="mood-bars">
						{getDominantMoods().map(([label, count]) => {
							const mood = moodColors.find((m) => m.label === label);
							return (
								<div key={label} className="mood-bar-item">
									<span className="bar-label">{label}</span>
									<div className="bar-track">
										<div
											className="bar-fill"
											style={{
												width: `${(count / 30) * 100}%`,
												background: mood?.color || "#666",
											}}
										/>
									</div>
									<span className="bar-count">{count}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className="recent-section">
				<h3>Recent</h3>
				<div className="recent-list">
					{entries.slice(0, 7).map((entry) => (
						<div key={entry.id} className="recent-item">
							<div className="recent-dot" style={{ background: entry.color }} />
							<div className="recent-info">
								<span className="recent-label">{entry.label}</span>
								{entry.note && (
									<span className="recent-note">{entry.note}</span>
								)}
							</div>
							<span className="recent-time">
								{new Date(entry.timestamp).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
					))}
				</div>
			</div>

			{viewingDate && (
				<div className="modal" onClick={() => setViewingDate(null)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<button className="close" onClick={() => setViewingDate(null)}>
							×
						</button>
						<h3>
							{new Date(viewingDate).toLocaleDateString("en-US", {
								weekday: "long",
								month: "long",
								day: "numeric",
							})}
						</h3>
						{entries
							.filter(
								(e) =>
									new Date(e.timestamp).toISOString().split("T")[0] ===
									new Date(viewingDate).toISOString().split("T")[0],
							)
							.map((entry) => (
								<div
									key={entry.id}
									className="modal-entry"
									style={{ borderLeftColor: entry.color }}
								>
									<span className="modal-label">{entry.label}</span>
									<span className="modal-time">
										{new Date(entry.timestamp).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
										})}
									</span>
									{entry.note && <p className="modal-note">{entry.note}</p>}
								</div>
							))}
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #f5f0e8;
          color: #2d2a26;
          padding: 1.5rem;
          font-family: 'Newsreader', Georgia, serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(45, 42, 38, 0.5);
          text-decoration: none;
          font-size: 0.85rem;
          font-family: system-ui, sans-serif;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 2.2rem;
          font-weight: 400;
          font-style: italic;
          margin: 0;
          color: #1a1816;
        }

        .header p {
          color: rgba(45, 42, 38, 0.5);
          font-size: 0.95rem;
          margin-top: 0.25rem;
          font-family: system-ui, sans-serif;
        }

        .today-section {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 20px rgba(0,0,0,0.04);
        }

        .today-mood {
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          color: white;
        }

        .mood-label {
          font-size: 1.8rem;
          font-weight: 500;
          display: block;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .mood-note {
          margin: 0.75rem 0;
          font-size: 0.95rem;
          opacity: 0.9;
          font-style: italic;
        }

        .mood-time {
          font-size: 0.8rem;
          opacity: 0.7;
          font-family: system-ui, sans-serif;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .mood-btn {
          aspect-ratio: 1;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          font-size: 1.2rem;
          color: white;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mood-btn.selected {
          border-color: #2d2a26;
          transform: scale(1.1);
        }

        .mood-form {
          text-align: center;
        }

        .selected-label {
          font-size: 1rem;
          margin: 0 0 1rem;
          color: #2d2a26;
        }

        .mood-form textarea {
          width: 100%;
          background: #f5f0e8;
          border: none;
          border-radius: 0.75rem;
          padding: 0.75rem;
          font-family: inherit;
          font-size: 0.9rem;
          resize: none;
          height: 60px;
          box-sizing: border-box;
          margin-bottom: 0.75rem;
        }

        .log-btn {
          background: #2d2a26;
          color: #f5f0e8;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          font-family: system-ui, sans-serif;
          transition: all 0.2s;
        }

        .log-btn:hover {
          transform: translateY(-2px);
        }

        .stats-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-btn, .stat-item {
          flex: 1;
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }

        .stat-btn {
          border: none;
          cursor: pointer;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          font-family: system-ui, sans-serif;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(45, 42, 38, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: system-ui, sans-serif;
        }

        .calendar-section {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .calendar-header h3 {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 500;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .day-name {
          text-align: center;
          font-size: 0.65rem;
          color: rgba(45, 42, 38, 0.4);
          padding: 0.25rem;
          font-family: system-ui, sans-serif;
        }

        .calendar-day {
          aspect-ratio: 1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-family: system-ui, sans-serif;
          cursor: pointer;
          color: rgba(45, 42, 38, 0.6);
        }

        .calendar-day.empty {
          background: #f5f0e8;
        }

        .calendar-day.has-entry {
          color: white;
        }

        .calendar-day.hidden {
          visibility: hidden;
        }

        .insights-section {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .insights-section h3 {
          margin: 0 0 1rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(45, 42, 38, 0.5);
          font-family: system-ui, sans-serif;
        }

        .mood-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mood-bar-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-label {
          width: 80px;
          font-size: 0.8rem;
          font-family: system-ui, sans-serif;
        }

        .bar-track {
          flex: 1;
          height: 8px;
          background: #f5f0e8;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .bar-count {
          width: 24px;
          text-align: right;
          font-size: 0.75rem;
          color: rgba(45, 42, 38, 0.5);
          font-family: system-ui, sans-serif;
        }

        .recent-section h3 {
          margin: 0 0 1rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(45, 42, 38, 0.5);
          font-family: system-ui, sans-serif;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.75rem;
        }

        .recent-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .recent-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .recent-label {
          font-size: 0.9rem;
        }

        .recent-note {
          font-size: 0.75rem;
          color: rgba(45, 42, 38, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-style: italic;
        }

        .recent-time {
          font-size: 0.75rem;
          color: rgba(45, 42, 38, 0.4);
          font-family: system-ui, sans-serif;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 320px;
          position: relative;
        }

        .modal-content h3 {
          margin: 0 0 1rem;
          font-size: 1rem;
        }

        .close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: rgba(45, 42, 38, 0.5);
        }

        .modal-entry {
          padding: 0.75rem;
          border-left: 4px solid;
          margin-bottom: 0.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
          background: #f5f0e8;
        }

        .modal-label {
          font-weight: 500;
          display: block;
        }

        .modal-time {
          font-size: 0.75rem;
          color: rgba(45, 42, 38, 0.5);
        }

        .modal-note {
          margin: 0.5rem 0 0;
          font-size: 0.85rem;
          font-style: italic;
        }
      `}</style>
		</div>
	);
}
