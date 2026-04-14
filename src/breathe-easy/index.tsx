import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const patterns = {
	"4-7-8": { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8 },
	box: { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, hold2: 4 },
	energizing: { name: "Energizing", inhale: 4, hold: 0, exhale: 4 },
};

export default function BreatheEasy() {
	const [pattern, setPattern] = useState<keyof typeof patterns>("4-7-8");
	const [phase, setPhase] = useState<
		"inhale" | "hold" | "exhale" | "hold2" | "idle"
	>("idle");
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [duration, setDuration] = useState(5);

	useEffect(() => {
		let interval: number;
		if (isRunning && seconds < duration * 60) {
			interval = window.setInterval(() => {
				setSeconds((s) => s + 1);
			}, 1000);
		} else if (seconds >= duration * 60) {
			setIsRunning(false);
			setPhase("idle");
		}
		return () => clearInterval(interval);
	}, [isRunning, seconds, duration]);

	useEffect(() => {
		if (!isRunning) return;
		const p = patterns[pattern];
		const cycleTime = seconds % (p.inhale + p.hold + p.exhale + (p.hold2 || 0));
		if (cycleTime < p.inhale) setPhase("inhale");
		else if (cycleTime < p.inhale + p.hold) setPhase("hold");
		else if (cycleTime < p.inhale + p.hold + p.exhale) setPhase("exhale");
		else if (p.hold2) setPhase("hold2");
	}, [seconds, isRunning, pattern]);

	const scale = phase === "inhale" ? 1.3 : phase === "exhale" ? 0.8 : 1;
	const label =
		phase === "inhale"
			? "Breathe In"
			: phase === "hold"
				? "Hold"
				: phase === "exhale"
					? "Breathe Out"
					: phase === "hold2"
						? "Hold"
						: "Ready";

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Breathe Easy</h1>
				<p>Guided breathing</p>
			</div>
			<div className="pattern-tabs">
				{Object.entries(patterns).map(([k, v]) => (
					<button
						key={k}
						className={pattern === k ? "active" : ""}
						onClick={() => setPattern(k as keyof typeof patterns)}
					>
						{v.name}
					</button>
				))}
			</div>
			<div className="circle-container">
				<div
					className="breathe-circle"
					style={{ transform: `scale(${scale})` }}
				>
					<span className="phase-label">{label}</span>
				</div>
			</div>
			<div className="controls">
				<select
					value={duration}
					onChange={(e) => setDuration(parseInt(e.target.value))}
					disabled={isRunning}
				>
					<option value={1}>1 min</option>
					<option value={3}>3 min</option>
					<option value={5}>5 min</option>
					<option value={10}>10 min</option>
				</select>
				<button
					className={isRunning ? "stop" : "start"}
					onClick={() => {
						setIsRunning(!isRunning);
						if (!isRunning) setSeconds(0);
					}}
				>
					{isRunning ? "Stop" : "Start"}
				</button>
			</div>
			<div className="progress">
				{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} /{" "}
				{duration}:00
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        .pattern-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
        .pattern-tabs button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.15); border: none; border-radius: 1.5rem; color: white; cursor: pointer; font-size: 0.85rem; }
        .pattern-tabs button.active { background: white; color: #667eea; }
        .circle-container { margin-bottom: 2rem; }
        .breathe-circle { width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; transition: transform 4s ease-in-out; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); }
        .phase-label { font-size: 1.2rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        .controls { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .controls select { padding: 0.6rem; background: rgba(255,255,255,0.2); border: none; border-radius: 0.5rem; color: white; }
        .controls button { padding: 0.6rem 2rem; background: white; border: none; border-radius: 2rem; color: #667eea; font-weight: 600; cursor: pointer; }
        .controls button.stop { background: #ff6b6b; color: white; }
        .progress { font-size: 1.5rem; font-weight: 600; }
      `}</style>
		</div>
	);
}
