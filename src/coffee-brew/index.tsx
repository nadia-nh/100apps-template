import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface BrewMethod {
	id: string;
	name: string;
	ratio: string;
	temp: string;
	time: string;
	phases: { name: string; duration: number }[];
}

const brewMethods: BrewMethod[] = [
	{
		id: "pour-over",
		name: "Pour Over",
		ratio: "1:16",
		temp: "200-205°F",
		time: "3-4 min",
		phases: [
			{ name: "Bloom", duration: 30 },
			{ name: "Pour 1", duration: 45 },
			{ name: "Pour 2", duration: 45 },
			{ name: "Pour 3", duration: 45 },
			{ name: "Drain", duration: 30 },
		],
	},
	{
		id: "french-press",
		name: "French Press",
		ratio: "1:15",
		temp: "200°F",
		time: "4 min",
		phases: [
			{ name: "Add water", duration: 10 },
			{ name: "Steep", duration: 240 },
			{ name: "Plunge", duration: 30 },
		],
	},
	{
		id: "espresso",
		name: "Espresso",
		ratio: "1:2",
		temp: "200°F",
		time: "25-30 sec",
		phases: [
			{ name: "Pre-infusion", duration: 5 },
			{ name: "Extract", duration: 25 },
		],
	},
	{
		id: "aeropress",
		name: "AeroPress",
		ratio: "1:12",
		temp: "185-205°F",
		time: "1-2 min",
		phases: [
			{ name: "Add water", duration: 10 },
			{ name: "Stir", duration: 10 },
			{ name: "Steep", duration: 60 },
			{ name: "Press", duration: 30 },
		],
	},
	{
		id: "cold-brew",
		name: "Cold Brew",
		ratio: "1:8",
		temp: "Cold",
		time: "12-24 hr",
		phases: [
			{ name: "Combine", duration: 60 },
			{ name: "Wait", duration: 60 },
		],
	},
];

export default function CoffeeBrew() {
	const [method, setMethod] = useState<BrewMethod>(brewMethods[0]);
	const [isBrewing, setIsBrewing] = useState(false);
	const [currentPhase, setCurrentPhase] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [totalElapsed, setTotalElapsed] = useState(0);
	const intervalRef = useRef<number | null>(null);

	const totalDuration = method.phases.reduce((sum, p) => sum + p.duration, 0);

	useEffect(() => {
		if (isBrewing && timeLeft > 0) {
			intervalRef.current = window.setInterval(() => {
				setTimeLeft((t) => t - 1);
				setTotalElapsed((e) => e + 1);
			}, 1000);
		} else if (
			isBrewing &&
			timeLeft === 0 &&
			currentPhase < method.phases.length - 1
		) {
			setCurrentPhase((p) => p + 1);
			setTimeLeft(method.phases[currentPhase + 1].duration);
		} else if (isBrewing && timeLeft === 0) {
			setIsBrewing(false);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isBrewing, timeLeft, currentPhase, method]);

	const startBrew = () => {
		setIsBrewing(true);
		setCurrentPhase(0);
		setTimeLeft(method.phases[0].duration);
		setTotalElapsed(0);
	};

	const reset = () => {
		setIsBrewing(false);
		setCurrentPhase(0);
		setTimeLeft(0);
		setTotalElapsed(0);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const progress = totalElapsed / totalDuration;

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Coffee Brew</h1>
				<p>Perfect your craft</p>
			</div>

			<div className="method-selector">
				{brewMethods.map((m) => (
					<button
						key={m.id}
						className={`method-btn ${method.id === m.id ? "active" : ""}`}
						onClick={() => {
							setMethod(m);
							reset();
						}}
					>
						{m.name}
					</button>
				))}
			</div>

			<div className="brew-guide">
				<div className="brew-info">
					<div className="info-row">
						<span className="info-label">Ratio</span>
						<span className="info-value">{method.ratio}</span>
					</div>
					<div className="info-row">
						<span className="info-label">Temp</span>
						<span className="info-value">{method.temp}</span>
					</div>
					<div className="info-row">
						<span className="info-label">Time</span>
						<span className="info-value">{method.time}</span>
					</div>
				</div>

				<div className="timer-circle">
					<svg viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r="45"
							fill="none"
							stroke="rgba(255,255,255,0.1)"
							strokeWidth="4"
						/>
						<circle
							cx="50"
							cy="50"
							r="45"
							fill="none"
							stroke="#c4a77d"
							strokeWidth="4"
							strokeLinecap="round"
							strokeDasharray={2 * Math.PI * 45}
							strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
							transform="rotate(-90 50 50)"
							style={{ transition: "stroke-dashoffset 1s linear" }}
						/>
					</svg>
					<div className="timer-content">
						{isBrewing ? (
							<>
								<span className="phase-name">
									{method.phases[currentPhase].name}
								</span>
								<span className="timer-display">{formatTime(timeLeft)}</span>
							</>
						) : (
							<>
								<span className="timer-display">
									{formatTime(totalDuration)}
								</span>
								<span className="phase-name">Ready</span>
							</>
						)}
					</div>
				</div>

				<div className="phases-list">
					{method.phases.map((phase, i) => (
						<div
							key={phase.name}
							className={`phase-item ${i < currentPhase ? "done" : ""} ${i === currentPhase ? "current" : ""}`}
						>
							<span className="phase-dot"></span>
							<span className="phase-label">{phase.name}</span>
							<span className="phase-duration">
								{formatTime(phase.duration)}
							</span>
						</div>
					))}
				</div>

				<button
					className={`brew-btn ${isBrewing ? "brewing" : ""}`}
					onClick={isBrewing ? reset : startBrew}
				>
					{isBrewing ? "Reset" : "Start Brewing"}
				</button>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #1c1917;
          color: #e8e4df;
          padding: 1.5rem;
          font-family: 'Crimson Pro', Georgia, serif;
        }

        .back-button {
          position: fixed;
          top: 1rem;
          left: 1rem;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 0.8rem;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .header h1 {
          font-size: 1.8rem;
          font-weight: 400;
          margin: 0;
          font-style: italic;
        }

        .header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .method-selector {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .method-btn {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1.5rem;
          color: rgba(255,255,255,0.6);
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .method-btn.active {
          background: #c4a77d;
          color: #1c1917;
          border-color: #c4a77d;
        }

        .brew-guide {
          background: rgba(255,255,255,0.03);
          border-radius: 1.5rem;
          padding: 1.5rem;
        }

        .brew-info {
          display: flex;
          justify-content: space-around;
          margin-bottom: 1.5rem;
        }

        .info-row {
          text-align: center;
        }

        .info-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 600;
          color: #c4a77d;
        }

        .timer-circle {
          width: 200px;
          height: 200px;
          margin: 0 auto 1.5rem;
          position: relative;
        }

        .timer-circle svg {
          width: 100%;
          height: 100%;
        }

        .timer-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .timer-display {
          display: block;
          font-size: 2.5rem;
          font-weight: 300;
          font-variant-numeric: tabular-nums;
        }

        .phase-name {
          display: block;
          font-size: 0.8rem;
          color: #c4a77d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
        }

        .phases-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .phase-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: 0.5rem;
          opacity: 0.5;
        }

        .phase-item.done {
          opacity: 1;
        }

        .phase-item.current {
          background: rgba(196, 167, 125, 0.15);
          opacity: 1;
        }

        .phase-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        .phase-item.done .phase-dot {
          background: #c4a77d;
        }

        .phase-label {
          flex: 1;
          font-size: 0.85rem;
        }

        .phase-duration {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          font-variant-numeric: tabular-nums;
        }

        .brew-btn {
          width: 100%;
          padding: 1rem;
          background: #c4a77d;
          border: none;
          border-radius: 1rem;
          color: #1c1917;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .brew-btn:hover {
          transform: translateY(-2px);
        }

        .brew-btn.brewing {
          background: rgba(255,255,255,0.1);
          color: #e8e4df;
        }
      `}</style>
		</div>
	);
}
