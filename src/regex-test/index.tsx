import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RegexTest() {
	const [pattern, setPattern] = useState("");
	const [flags, setFlags] = useState({ g: true, i: false, m: false });
	const [testString, setTestString] = useState(
		"The quick brown fox jumps over the lazy dog.\nThis is a TEST string with numbers 12345.",
	);
	const [matches, setMatches] = useState<string[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!pattern) {
			setMatches([]);
			setError("");
			return;
		}
		try {
			const flagStr = Object.entries(flags)
				.filter(([_, v]) => v)
				.map(([k]) => k)
				.join("");
			const regex = new RegExp(pattern, flagStr);
			const found = testString.match(regex);
			setMatches(found || []);
			setError("");
		} catch (e) {
			setError((e as Error).message);
			setMatches([]);
		}
	}, [pattern, flags, testString]);

	const commonPatterns = [
		{ label: "Email", pattern: "[\\w.-]+@[\\w.-]+\\.\\w+" },
		{ label: "URL", pattern: "https?://[\\w./%-]+" },
		{ label: "Phone", pattern: "\\d{3}[-.]?\\d{3}[-.]?\\d{4}" },
		{ label: "Date", pattern: "\\d{4}-\\d{2}-\\d{2}" },
		{ label: "IP", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
	];

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Regex Test</h1>
				<p>Test regular expressions</p>
			</div>
			<div className="pattern-section">
				<input
					type="text"
					placeholder="Enter regex pattern..."
					value={pattern}
					onChange={(e) => setPattern(e.target.value)}
					className="pattern-input"
				/>
				<div className="flags">
					{Object.entries(flags).map(([f, v]) => (
						<label key={f}>
							<input
								type="checkbox"
								checked={v}
								onChange={() => setFlags({ ...flags, [f]: !v })}
							/>
							{f}
						</label>
					))}
				</div>
				{error && <div className="error">{error}</div>}
			</div>
			<div className="quick-patterns">
				{commonPatterns.map((p) => (
					<button key={p.label} onClick={() => setPattern(p.pattern)}>
						{p.label}
					</button>
				))}
			</div>
			<div className="test-section">
				<span className="section-label">Test String</span>
				<textarea
					value={testString}
					onChange={(e) => setTestString(e.target.value)}
				/>
			</div>
			<div className="results-section">
				<span className="section-label">Matches ({matches.length})</span>
				<div className="matches">
					{matches.length === 0 ? (
						<span className="no-match">No matches</span>
					) : (
						matches.map((m, i) => (
							<span key={i} className="match">
								{m}
							</span>
						))
					)}
				</div>
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #141e30 0%, #243b55 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'JetBrains Mono', monospace; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #56ab2f, #a8e063); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .pattern-section { margin-bottom: 1rem; }
        .pattern-input { width: 100%; padding: 0.85rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(86,171,47,0.3); border-radius: 0.5rem; color: #a8e063; font-size: 1rem; box-sizing: border-box; }
        .flags { display: flex; gap: 1rem; margin-top: 0.5rem; }
        .flags label { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; cursor: pointer; }
        .flags input { accent-color: #56ab2f; }
        .error { margin-top: 0.5rem; padding: 0.5rem; background: rgba(231,76,60,0.15); border-radius: 0.4rem; color: #e74c3c; font-size: 0.8rem; }
        .quick-patterns { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
        .quick-patterns button { padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; color: white; cursor: pointer; font-size: 0.8rem; }
        .quick-patterns button:hover { background: rgba(86,171,47,0.2); }
        .test-section, .results-section { margin-bottom: 1rem; }
        .section-label { display: block; font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; text-transform: uppercase; }
        .test-section textarea { width: 100%; min-height: 100px; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; font-size: 0.9rem; box-sizing: border-box; line-height: 1.5; }
        .matches { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .match { padding: 0.4rem 0.6rem; background: rgba(86,171,47,0.2); border-radius: 0.4rem; color: #a8e063; font-size: 0.85rem; }
        .no-match { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
      `}</style>
		</div>
	);
}
