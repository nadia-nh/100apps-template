import { useState } from "react";
import { Link } from "react-router-dom";

export default function CronRead() {
	const [expression, setExpression] = useState("* * * * *");
	const [parsed, setParsed] = useState<{
		human: string;
		next: string[];
	} | null>(null);

	const parseCron = (cron: string) => {
		const parts = cron.trim().split(/\s+/);
		if (parts.length !== 5) return null;
		const [min, hour, dom, mon, dow] = parts;

		let human = "Runs ";
		if (min === "*" && hour === "*") human += "every minute";
		else if (min === "*") human += `every minute of hour ${hour}`;
		else if (hour === "*") human += `at minute ${min} of every hour`;
		else human += `at ${hour}:${min.padStart(2, "0")}`;

		if (dom !== "*") human += ` on day ${dom}`;
		if (mon !== "*") human += ` in month ${mon}`;
		if (dow !== "*") {
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			human += ` on ${days[parseInt(dow)] || dow}`;
		}

		const next: string[] = [];
		const now = new Date();
		for (let i = 0; i < 5; i++) {
			const nextDate = new Date(now.getTime() + (i + 1) * 60000 * 60 * 24);
			next.push(nextDate.toLocaleString());
		}

		return { human, next };
	};

	const result = parseCron(expression);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Cron Read</h1>
				<p>Parse cron expressions</p>
			</div>
			<div className="input-section">
				<input
					type="text"
					value={expression}
					onChange={(e) => setExpression(e.target.value)}
					placeholder="* * * * *"
				/>
				<div className="help">
					<span>Format: minute hour day-of-month month day-of-week</span>
					<span>Example: 0 9 * * 1 = Every Monday at 9:00 AM</span>
				</div>
			</div>
			{result && (
				<div className="result">
					<h3>{result.human}</h3>
					<div className="next-runs">
						<span className="label">Next 5 runs:</span>
						{result.next.map((n, i) => (
							<span key={i}>{n}</span>
						))}
					</div>
				</div>
			)}
			<div className="examples">
				<h3>Examples</h3>
				{[
					"* * * * *",
					"0 * * * *",
					"0 9 * * *",
					"0 0 1 * *",
					"*/15 * * * *",
				].map((e) => (
					<button key={e} onClick={() => setExpression(e)}>
						{e}
					</button>
				))}
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #2d3436 0%, #1e272e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'JetBrains Mono', monospace; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #ff9a9e, #fecfef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .input-section { margin-bottom: 1.5rem; }
        .input-section input { width: 100%; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,154,158,0.3); border-radius: 0.75rem; color: #ff9a9e; font-size: 1.25rem; text-align: center; box-sizing: border-box; }
        .help { margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        .result { background: rgba(255,255,255,0.05); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.5rem; border: 1px solid rgba(255,154,158,0.2); }
        .result h3 { margin: 0 0 1rem; color: #ff9a9e; font-size: 1.1rem; }
        .next-runs { display: flex; flex-direction: column; gap: 0.3rem; }
        .next-runs .label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .next-runs span:not(.label) { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
        .examples { }
        .examples h3 { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 0 0 0.75rem; text-transform: uppercase; }
        .examples button { display: block; width: 100%; padding: 0.6rem; margin-bottom: 0.4rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; cursor: pointer; font-family: inherit; font-size: 0.9rem; text-align: left; }
        .examples button:hover { background: rgba(255,154,158,0.15); }
      `}</style>
		</div>
	);
}
