import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Phase = "work" | "shortBreak" | "longBreak";

interface PhaseConfig {
	label: string;
	duration: number;
	color: string;
	sound: string;
}

const phases: Record<Phase, PhaseConfig> = {
	work: {
		label: "Focus",
		duration: 25 * 60,
		color: "#2d5a4a",
		sound: "forest-rain",
	},
	shortBreak: {
		label: "Short Break",
		duration: 5 * 60,
		color: "#4a3d5c",
		sound: "birdsong",
	},
	longBreak: {
		label: "Long Break",
		duration: 15 * 60,
		color: "#3d4a5c",
		sound: "gentle-stream",
	},
};

const ambientSounds = [
	{ id: "forest-rain", label: "Forest Rain", icon: "🌧️" },
	{ id: "birdsong", label: "Birdsong", icon: "🐦" },
	{ id: "gentle-stream", label: "Gentle Stream", icon: "💧" },
	{ id: "white-noise", label: "White Noise", icon: "📻" },
	{ id: "ocean-waves", label: "Ocean Waves", icon: "🌊" },
	{ id: "fireplace", label: "Fireplace", icon: "🔥" },
];

export default function PomodoroFlow() {
	const [phase, setPhase] = useState<Phase>("work");
	const [timeLeft, setTimeLeft] = useState(phases.work.duration);
	const [isRunning, setIsRunning] = useState(false);
	const [sessionsCompleted, setSessionsCompleted] = useState(0);
	const [selectedSound, setSelectedSound] = useState("forest-rain");
	const [soundVolume, setSoundVolume] = useState(0.3);
	const [breathPhase, setBreathPhase] = useState<
		"inhale" | "hold" | "exhale" | null
	>(null);
	const intervalRef = useRef<number | null>(null);
	const breatheRef = useRef<number | null>(null);

	useEffect(() => {
		if (isRunning && timeLeft > 0) {
			intervalRef.current = window.setInterval(() => {
				setTimeLeft((t) => t - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			handlePhaseComplete();
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isRunning, timeLeft]);

	useEffect(() => {
		if (!isRunning && (phase === "shortBreak" || phase === "longBreak")) {
			startBreathingGuide();
		} else {
			setBreathPhase(null);
			if (breatheRef.current) clearInterval(breatheRef.current);
		}
		return () => {
			if (breatheRef.current) clearInterval(breatheRef.current);
		};
	}, [phase, isRunning]);

	const startBreathingGuide = () => {
		let step = 0;
		const cycle = () => {
			if (step === 0) {
				setBreathPhase("inhale");
				breatheRef.current = window.setTimeout(() => {
					step = 1;
					if (phase === "shortBreak") {
						step = 2;
						setBreathPhase("exhale");
						breatheRef.current = window.setTimeout(cycle, 4000);
					} else {
						breatheRef.current = window.setTimeout(() => {
							step = 2;
							setBreathPhase("exhale");
							breatheRef.current = window.setTimeout(cycle, 8000);
						}, 7000);
					}
				}, 4000);
			}
		};
		cycle();
	};

	const handlePhaseComplete = () => {
		setIsRunning(false);
		if (phase === "work") {
			const newSessions = sessionsCompleted + 1;
			setSessionsCompleted(newSessions);
			if (newSessions % 4 === 0) {
				setPhase("longBreak");
				setTimeLeft(phases.longBreak.duration);
			} else {
				setPhase("shortBreak");
				setTimeLeft(phases.shortBreak.duration);
			}
		} else {
			setPhase("work");
			setTimeLeft(phases.work.duration);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const progress = 1 - timeLeft / phases[phase].duration;
	const breatheScale =
		breathPhase === "inhale" ? 1.3 : breathPhase === "exhale" ? 0.8 : 1;

	return (
		<div
			className="app-container"
			style={{ "--phase-color": phases[phase].color } as React.CSSProperties}
		>
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="pomodoro-main">
				<div className="phase-tabs">
					{(["work", "shortBreak", "longBreak"] as Phase[]).map((p) => (
						<button
							key={p}
							className={`phase-tab ${phase === p ? "active" : ""}`}
							onClick={() => {
								setPhase(p);
								setTimeLeft(phases[p].duration);
								setIsRunning(false);
							}}
						>
							{phases[p].label}
						</button>
					))}
				</div>

				<div className="timer-circle-container">
					<svg className="timer-ring" viewBox="0 0 200 200">
						<circle
							className="ring-bg"
							cx="100"
							cy="100"
							r="90"
							fill="none"
							stroke="rgba(255,255,255,0.1)"
							strokeWidth="8"
						/>
						<circle
							className="ring-progress"
							cx="100"
							cy="100"
							r="90"
							fill="none"
							stroke={phases[phase].color}
							strokeWidth="8"
							strokeLinecap="round"
							strokeDasharray={2 * Math.PI * 90}
							strokeDashoffset={2 * Math.PI * 90 * (1 - progress)}
							transform="rotate(-90 100 100)"
						/>
					</svg>

					<div
						className="breathing-guide"
						style={{
							transform: `scale(${breatheScale})`,
							opacity: breathPhase ? 1 : 0,
						}}
					>
						<div className="breathe-icon">
							{breathPhase === "inhale"
								? "🌬️"
								: breathPhase === "exhale"
									? "💨"
									: "⏸️"}
						</div>
						<span className="breathe-text">
							{breathPhase === "inhale"
								? "Breathe In"
								: breathPhase === "exhale"
									? "Breathe Out"
									: "Hold"}
						</span>
					</div>

					<div className="timer-display">
						<span className="time-text">{formatTime(timeLeft)}</span>
						<span className="phase-label">{phases[phase].label}</span>
					</div>
				</div>

				<button
					className={`start-button ${isRunning ? "running" : ""}`}
					onClick={() => setIsRunning(!isRunning)}
				>
					{isRunning ? "Pause" : "Start"}
				</button>

				<div className="sessions-counter">
					<span className="sessions-number">{sessionsCompleted}</span>
					<span className="sessions-label">Sessions Completed</span>
				</div>
			</div>

			<div className="sound-panel">
				<h3>Ambient Sound</h3>
				<div className="sound-grid">
					{ambientSounds.map((sound) => (
						<button
							key={sound.id}
							className={`sound-button ${selectedSound === sound.id ? "active" : ""}`}
							onClick={() => setSelectedSound(sound.id)}
						>
							<span className="sound-icon">{sound.icon}</span>
							<span className="sound-label">{sound.label}</span>
						</button>
					))}
				</div>
				<div className="volume-control">
					<span>Volume</span>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={soundVolume}
						onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
					/>
				</div>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a1f1c 0%, #0d110e 100%);
          color: #e8ebe9;
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
        }
        .back-button:hover {
          color: white;
        }

        .pomodoro-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2rem;
        }

        .phase-tabs {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          padding: 0.25rem;
          border-radius: 2rem;
          margin-bottom: 2rem;
        }

        .phase-tab {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          padding: 0.6rem 1.2rem;
          border-radius: 1.5rem;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .phase-tab.active {
          background: var(--phase-color);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .timer-circle-container {
          position: relative;
          width: 280px;
          height: 280px;
          margin-bottom: 2rem;
        }

        .timer-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .ring-progress {
          transition: stroke-dashoffset 1s linear;
        }

        .breathing-guide {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          transition: transform 4s ease-in-out, opacity 0.5s ease;
          pointer-events: none;
        }

        .breathe-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .breathe-text {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.7);
        }

        .timer-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .time-text {
          font-size: 3.5rem;
          font-weight: 300;
          font-variant-numeric: tabular-nums;
          letter-spacing: -2px;
          display: block;
        }

        .phase-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.5);
        }

        .start-button {
          background: var(--phase-color);
          border: none;
          color: white;
          padding: 1rem 3rem;
          border-radius: 3rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
        }

        .start-button:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .start-button.running {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
        }

        .sessions-counter {
          text-align: center;
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.03);
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .sessions-number {
          font-size: 2rem;
          font-weight: 700;
          display: block;
          color: var(--phase-color);
        }

        .sessions-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
        }

        .sound-panel {
          margin-top: 3rem;
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border-radius: 1.5rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .sound-panel h3 {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }

        .sound-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .sound-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 1rem 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sound-button:hover {
          background: rgba(255,255,255,0.08);
        }

        .sound-button.active {
          background: var(--phase-color);
          border-color: transparent;
        }

        .sound-icon {
          font-size: 1.5rem;
        }

        .sound-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 0.5rem;
        }

        .volume-control span {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }

        .volume-control input[type="range"] {
          flex: 1;
          accent-color: var(--phase-color);
        }
      `}</style>
		</div>
	);
}
