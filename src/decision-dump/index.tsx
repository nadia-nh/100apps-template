import { useState } from "react";
import { Link } from "react-router-dom";

export default function DecisionDump() {
	const [options, setOptions] = useState<string[]>([]);
	const [newOption, setNewOption] = useState("");
	const [result, setResult] = useState<string | null>(null);
	const [weights, setWeights] = useState<Record<string, number>>({});
	const [history, setHistory] = useState<{ result: string; time: Date }[]>([]);

	const add = () => {
		if (newOption.trim()) {
			setOptions([...options, newOption.trim()]);
			setWeights({ ...weights, [newOption.trim()]: 1 });
			setNewOption("");
		}
	};
	const remove = (opt: string) => {
		setOptions(options.filter((o) => o !== opt));
		const w = { ...weights };
		delete w[opt];
		setWeights(w);
	};

	const decide = () => {
		if (options.length === 0) return;
		const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
		let rand = Math.random() * totalWeight;
		let selected = options[0];
		for (const opt of options) {
			rand -= weights[opt] || 1;
			if (rand <= 0) {
				selected = opt;
				break;
			}
		}
		setResult(selected);
		setHistory([
			{ result: selected, time: new Date() },
			...history.slice(0, 9),
		]);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Decision Dump</h1>
				<p>Let fate decide</p>
			</div>
			<div className="input-row">
				<input
					value={newOption}
					onChange={(e) => setNewOption(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && add()}
					placeholder="Add an option..."
				/>
				<button onClick={add}>Add</button>
			</div>
			<div className="options-list">
				{options.map((opt) => (
					<div key={opt} className="option-item">
						<span>{opt}</span>
						<div className="weight-control">
							<button
								onClick={() =>
									setWeights({
										...weights,
										[opt]: Math.max(1, (weights[opt] || 1) - 1),
									})
								}
							>
								-
							</button>
							<span>{weights[opt] || 1}</span>
							<button
								onClick={() =>
									setWeights({ ...weights, [opt]: (weights[opt] || 1) + 1 })
								}
							>
								+
							</button>
						</div>
						<button className="remove" onClick={() => remove(opt)}>
							×
						</button>
					</div>
				))}
			</div>
			<button
				className="decide-btn"
				onClick={decide}
				disabled={options.length < 2}
			>
				Decide!
			</button>
			{result && <div className="result">{result}</div>}
			{history.length > 0 && (
				<div className="history">
					<h3>History</h3>
					{history.map((h, i) => (
						<div key={i} className="history-item">
							<span>{h.result}</span>
							<span className="time">{h.time.toLocaleTimeString()}</span>
						</div>
					))}
				</div>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #2d3436 0%, #1e272e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #a29bfe, #6c5ce7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .input-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .input-row input { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; }
        .input-row button { padding: 0.75rem 1.25rem; background: #6c5ce7; border: none; border-radius: 0.5rem; color: white; font-weight: 600; cursor: pointer; }
        .options-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .option-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem; }
        .option-item span { flex: 1; }
        .weight-control { display: flex; align-items: center; gap: 0.3rem; }
        .weight-control button { width: 24px; height: 24px; background: rgba(255,255,255,0.1); border: none; border-radius: 0.3rem; color: white; cursor: pointer; }
        .weight-control span { min-width: 20px; text-align: center; }
        .option-item .remove { width: 24px; height: 24px; background: rgba(255,107,107,0.2); border: none; border-radius: 0.3rem; color: #ff6b6b; cursor: pointer; }
        .decide-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #a29bfe, #6c5ce7); border: none; border-radius: 0.75rem; color: white; font-size: 1.1rem; font-weight: 700; cursor: pointer; }
        .decide-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .result { margin-top: 1.5rem; text-align: center; font-size: 1.5rem; font-weight: 700; color: #a29bfe; animation: pop 0.3s ease; }
        @keyframes pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .history { margin-top: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 1rem; padding: 1rem; }
        .history h3 { margin: 0 0 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .history-item { display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .history-item .time { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
      `}</style>
		</div>
	);
}
