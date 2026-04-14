import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Clock {
	id: string;
	city: string;
	timezone: string;
}

const timezones = [
	{ city: "New York", tz: "America/New_York", offset: -5 },
	{ city: "Los Angeles", tz: "America/Los_Angeles", offset: -8 },
	{ city: "Chicago", tz: "America/Chicago", offset: -6 },
	{ city: "London", tz: "Europe/London", offset: 0 },
	{ city: "Paris", tz: "Europe/Paris", offset: 1 },
	{ city: "Berlin", tz: "Europe/Berlin", offset: 1 },
	{ city: "Tokyo", tz: "Asia/Tokyo", offset: 9 },
	{ city: "Sydney", tz: "Australia/Sydney", offset: 11 },
	{ city: "Dubai", tz: "Asia/Dubai", offset: 4 },
	{ city: "Singapore", tz: "Asia/Singapore", offset: 8 },
	{ city: "Hong Kong", tz: "Asia/Hong_Kong", offset: 8 },
	{ city: "Mumbai", tz: "Asia/Kolkata", offset: 5.5 },
	{ city: "São Paulo", tz: "America/Sao_Paulo", offset: -3 },
	{ city: "Toronto", tz: "America/Toronto", offset: -5 },
	{ city: "Seoul", tz: "Asia/Seoul", offset: 9 },
];

export default function WorldClock() {
	const [clocks, setClocks] = useState<Clock[]>(() => {
		const saved = localStorage.getItem("world-clocks");
		return saved
			? JSON.parse(saved)
			: [
					{ id: "1", city: "New York", timezone: "America/New_York" },
					{ id: "2", city: "London", timezone: "Europe/London" },
					{ id: "3", city: "Tokyo", timezone: "Asia/Tokyo" },
				];
	});
	const [currentTime, setCurrentTime] = useState(new Date());
	const [showAdd, setShowAdd] = useState(false);
	const [compareFrom, setCompareFrom] = useState<string | null>(null);
	const [compareTo, setCompareTo] = useState<string | null>(null);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		localStorage.setItem("world-clocks", JSON.stringify(clocks));
	}, [clocks]);

	const getTimeForTimezone = (tz: string) => {
		return new Date(currentTime.toLocaleString("en-US", { timeZone: tz }));
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const getOffset = (tz: string) => {
		const tzData = timezones.find((t) => t.tz === tz);
		return tzData?.offset ?? 0;
	};

	const getTimeDifference = (tz1: string, tz2: string) => {
		const offset1 = getOffset(tz1);
		const offset2 = getOffset(tz2);
		const diff = offset2 - offset1;
		const hours = Math.floor(Math.abs(diff));
		const minutes = Math.abs((diff % 1) * 60);
		const sign = diff >= 0 ? "+" : "-";
		return `${sign}${hours}h ${minutes > 0 ? minutes + "m" : ""}`;
	};

	const addClock = (tz: string) => {
		const tzData = timezones.find((t) => t.tz === tz);
		if (!tzData || clocks.some((c) => c.timezone === tz)) return;
		setClocks([
			...clocks,
			{ id: `clock-${Date.now()}`, city: tzData.city, timezone: tz },
		]);
		setShowAdd(false);
	};

	const removeClock = (id: string) => {
		setClocks(clocks.filter((c) => c.id !== id));
		if (compareFrom === id) setCompareFrom(null);
		if (compareTo === id) setCompareTo(null);
	};

	const availableToAdd = timezones.filter(
		(tz) => !clocks.some((c) => c.timezone === tz.tz),
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>World Clock</h1>
				<p>Track time around the world</p>
			</div>

			<div className="compare-controls">
				<select
					value={compareFrom || ""}
					onChange={(e) => setCompareFrom(e.target.value || null)}
				>
					<option value="">Select city to compare...</option>
					{clocks.map((c) => (
						<option key={c.id} value={c.id}>
							{c.city}
						</option>
					))}
				</select>
				{compareFrom && (
					<>
						<span className="vs">vs</span>
						<select
							value={compareTo || ""}
							onChange={(e) => setCompareTo(e.target.value || null)}
						>
							<option value="">Select city...</option>
							{clocks
								.filter((c) => c.id !== compareFrom)
								.map((c) => (
									<option key={c.id} value={c.id}>
										{c.city}
									</option>
								))}
						</select>
					</>
				)}
			</div>

			{compareFrom && compareTo && (
				<div className="diff-display">
					<span className="diff-label">Time difference:</span>
					<span className="diff-value">
						{getTimeDifference(
							clocks.find((c) => c.id === compareFrom)?.timezone || "",
							clocks.find((c) => c.id === compareTo)?.timezone || "",
						)}
					</span>
				</div>
			)}

			<div className="clock-grid">
				{clocks.map((clock) => {
					const time = getTimeForTimezone(clock.timezone);
					return (
						<div key={clock.id} className="clock-card">
							<button
								className="remove-clock"
								onClick={() => removeClock(clock.id)}
							>
								×
							</button>
							<span className="clock-city">{clock.city}</span>
							<span className="clock-time">{formatTime(time)}</span>
							<span className="clock-date">{formatDate(time)}</span>
							<span className="clock-offset">
								UTC{getOffset(clock.timezone) >= 0 ? "+" : ""}
								{getOffset(clock.timezone)}
							</span>
						</div>
					);
				})}

				<button className="add-clock-card" onClick={() => setShowAdd(true)}>
					<span className="add-icon">+</span>
					<span>Add City</span>
				</button>
			</div>

			{showAdd && (
				<div className="modal-overlay" onClick={() => setShowAdd(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Add City</h3>
						<div className="city-list">
							{availableToAdd.map((tz) => (
								<button
									key={tz.tz}
									className="city-option"
									onClick={() => addClock(tz.tz)}
								>
									<span className="city-name">{tz.city}</span>
									<span className="city-offset">
										UTC{tz.offset >= 0 ? "+" : ""}
										{tz.offset}
									</span>
								</button>
							))}
						</div>
						<button className="close-modal" onClick={() => setShowAdd(false)}>
							Close
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'JetBrains Mono', monospace; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin-top: 1rem; margin-bottom: 1.5rem; }
        .header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.25rem; background: linear-gradient(90deg, #a29bfe, #6c5ce7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .compare-controls { display: flex; gap: 0.5rem; align-items: center; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap; }
        .compare-controls select { padding: 0.6rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; font-family: system-ui; }
        .vs { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        .diff-display { text-align: center; padding: 0.75rem; background: rgba(108,92,231,0.15); border-radius: 0.75rem; margin-bottom: 1.5rem; border: 1px solid rgba(108,92,231,0.3); }
        .diff-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-right: 0.5rem; }
        .diff-value { font-size: 1.25rem; font-weight: 700; color: #a29bfe; }
        .clock-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
        .clock-card { position: relative; background: rgba(255,255,255,0.04); border-radius: 1.25rem; padding: 1.5rem 1rem; border: 1px solid rgba(255,255,255,0.06); text-align: center; transition: all 0.2s; }
        .clock-card:hover { transform: translateY(-2px); border-color: rgba(162,155,254,0.3); }
        .remove-clock { position: absolute; top: 0.5rem; right: 0.5rem; width: 20px; height: 20px; background: rgba(255,107,107,0.2); border: none; border-radius: 50%; color: #ff6b6b; cursor: pointer; font-size: 0.9rem; opacity: 0; transition: opacity 0.2s; }
        .clock-card:hover .remove-clock { opacity: 1; }
        .clock-city { display: block; font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
        .clock-time { display: block; font-size: 1.75rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
        .clock-date { display: block; font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 0.25rem; }
        .clock-offset { display: inline-block; padding: 0.2rem 0.5rem; background: rgba(162,155,254,0.2); border-radius: 0.25rem; font-size: 0.7rem; color: #a29bfe; }
        .add-clock-card { background: rgba(255,255,255,0.03); border-radius: 1.25rem; padding: 1.5rem 1rem; border: 2px dashed rgba(255,255,255,0.15); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; min-height: 160px; transition: all 0.2s; }
        .add-clock-card:hover { border-color: #a29bfe; background: rgba(162,155,254,0.05); }
        .add-icon { font-size: 2rem; color: rgba(255,255,255,0.4); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #1a1a3e; border-radius: 1.25rem; padding: 1.5rem; width: 100%; max-width: 350px; max-height: 80vh; overflow-y: auto; }
        .modal h3 { margin: 0 0 1rem; color: #a29bfe; }
        .city-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .city-option { display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.05); border: none; border-radius: 0.5rem; color: white; cursor: pointer; text-align: left; }
        .city-option:hover { background: rgba(162,155,254,0.2); }
        .city-offset { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        .close-modal { width: 100%; padding: 0.75rem; background: #a29bfe; border: none; border-radius: 0.5rem; color: #1a1a3e; font-weight: 600; cursor: pointer; }
      `}</style>
		</div>
	);
}
