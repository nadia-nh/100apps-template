import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface WaterEntry {
	id: string;
	amount: number;
	timestamp: Date;
}

const quickAmounts = [250, 500, 750, 1000];

export default function WaterLog() {
	const [entries, setEntries] = useState<WaterEntry[]>(() => {
		const saved = localStorage.getItem("water-log-entries");
		return saved ? JSON.parse(saved) : [];
	});
	const [dailyGoal, setDailyGoal] = useState(() => {
		const saved = localStorage.getItem("water-log-goal");
		return saved ? parseInt(saved) : 2000;
	});
	const [customAmount, setCustomAmount] = useState("");

	useEffect(() => {
		localStorage.setItem("water-log-entries", JSON.stringify(entries));
	}, [entries]);

	useEffect(() => {
		localStorage.setItem("water-log-goal", dailyGoal.toString());
	}, [dailyGoal]);

	const todayEntries = entries.filter(
		(e) => new Date(e.timestamp).toDateString() === new Date().toDateString(),
	);

	const totalToday = todayEntries.reduce((sum, e) => sum + e.amount, 0);
	const progress = Math.min((totalToday / dailyGoal) * 100, 100);

	const addWater = (amount: number) => {
		const newEntry: WaterEntry = {
			id: Date.now().toString(),
			amount,
			timestamp: new Date(),
		};
		setEntries([newEntry, ...entries]);
	};

	const removeEntry = (id: string) => {
		setEntries(entries.filter((e) => e.id !== id));
	};

	const handleCustomAdd = () => {
		const amount = parseInt(customAmount);
		if (amount > 0) {
			addWater(amount);
			setCustomAmount("");
		}
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Hydration</h1>
				<p className="date">
					{new Date().toLocaleDateString("en-US", {
						weekday: "long",
						month: "long",
						day: "numeric",
					})}
				</p>
			</div>

			<div className="tank-container">
				<div className="tank">
					<div className="water" style={{ height: `${progress}%` }}>
						<div className="wave"></div>
						<div className="wave wave-2"></div>
						<div className="bubbles">
							{[...Array(8)].map((_, i) => (
								<div
									key={i}
									className="bubble"
									style={{
										left: `${Math.random() * 100}%`,
										animationDelay: `${Math.random() * 3}s`,
										animationDuration: `${2 + Math.random() * 2}s`,
									}}
								></div>
							))}
						</div>
					</div>
					<div className="tank-marks">
						{[100, 75, 50, 25, 0].map((mark) => (
							<div key={mark} className="mark">
								<span>{Math.round((dailyGoal * mark) / 100)}ml</span>
							</div>
						))}
					</div>
				</div>

				<div className="progress-info">
					<div className="percentage">{Math.round(progress)}%</div>
					<div className="amounts">
						<span className="current">{totalToday}ml</span>
						<span className="divider">/</span>
						<span className="goal">{dailyGoal}ml</span>
					</div>
				</div>
			</div>

			<div className="quick-buttons">
				{quickAmounts.map((amount) => (
					<button
						key={amount}
						className="quick-btn"
						onClick={() => addWater(amount)}
					>
						+{amount}ml
					</button>
				))}
			</div>

			<div className="custom-input">
				<input
					type="number"
					placeholder="Custom amount (ml)"
					value={customAmount}
					onChange={(e) => setCustomAmount(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
				/>
				<button onClick={handleCustomAdd}>Add</button>
			</div>

			<div className="entries-section">
				<h3>Today's Log</h3>
				{todayEntries.length === 0 ? (
					<p className="empty-state">
						No water logged yet today. Stay hydrated!
					</p>
				) : (
					<div className="entries-list">
						{todayEntries.map((entry) => (
							<div key={entry.id} className="entry">
								<div className="entry-info">
									<span className="entry-amount">{entry.amount}ml</span>
									<span className="entry-time">
										{new Date(entry.timestamp).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
										})}
									</span>
								</div>
								<button
									className="delete-btn"
									onClick={() => removeEntry(entry.id)}
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="settings-section">
				<label>
					Daily Goal
					<input
						type="number"
						value={dailyGoal}
						onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
						step="100"
					/>
					<span>ml</span>
				</label>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a1628 0%, #061018 100%);
          color: #e8f4f8;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
          z-index: 10;
        }
        .back-button:hover { color: white; }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 300;
          margin: 0;
          background: linear-gradient(135deg, #4fc3f7, #29b6f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .date {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .tank-container {
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .tank {
          width: 120px;
          height: 240px;
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(79, 195, 247, 0.3);
          border-radius: 1rem;
          position: relative;
          overflow: hidden;
        }

        .water {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #29b6f6 0%, #0288d1 100%);
          transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wave {
          position: absolute;
          top: -8px;
          left: 0;
          right: 0;
          height: 16px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='%2329b6f6' d='M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E") repeat-x;
          background-size: 600px 100%;
          animation: wave 8s linear infinite;
        }

        .wave-2 {
          top: -4px;
          opacity: 0.5;
          animation: wave 12s linear infinite reverse;
        }

        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 600px; }
        }

        .bubbles {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
        }

        .bubble {
          position: absolute;
          bottom: 0;
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          animation: rise 3s ease-in infinite;
        }

        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
        }

        .tank-marks {
          position: absolute;
          right: -50px;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .mark {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.3);
        }

        .progress-info {
          text-align: center;
        }

        .percentage {
          font-size: 3rem;
          font-weight: 700;
          color: #4fc3f7;
          line-height: 1;
        }

        .amounts {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .current {
          color: white;
          font-weight: 600;
        }

        .divider {
          color: rgba(255,255,255,0.3);
          margin: 0 0.3rem;
        }

        .goal {
          color: rgba(255,255,255,0.5);
        }

        .quick-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .quick-btn {
          background: rgba(79, 195, 247, 0.15);
          border: 1px solid rgba(79, 195, 247, 0.3);
          color: #4fc3f7;
          padding: 1rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-btn:hover {
          background: rgba(79, 195, 247, 0.25);
          transform: translateY(-2px);
        }

        .custom-input {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .custom-input input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          padding: 0.8rem 1rem;
          color: white;
          font-size: 1rem;
        }

        .custom-input input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .custom-input button {
          background: #4fc3f7;
          border: none;
          color: #061018;
          padding: 0.8rem 1.5rem;
          border-radius: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .custom-input button:hover {
          background: #29b6f6;
        }

        .entries-section {
          background: rgba(255,255,255,0.02);
          border-radius: 1.5rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .entries-section h3 {
          margin: 0 0 1rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
        }

        .empty-state {
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 0.9rem;
          padding: 2rem 0;
        }

        .entries-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .entry {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.75rem;
        }

        .entry-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .entry-amount {
          font-weight: 600;
          color: #4fc3f7;
        }

        .entry-time {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.3);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          transition: color 0.2s;
        }

        .delete-btn:hover {
          color: #ff5252;
        }

        .settings-section {
          background: rgba(255,255,255,0.02);
          border-radius: 1rem;
          padding: 1rem;
        }

        .settings-section label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
        }

        .settings-section input {
          width: 80px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.4rem 0.6rem;
          color: white;
          font-size: 0.9rem;
          text-align: right;
        }

        .settings-section span {
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
        }
      `}</style>
		</div>
	);
}
