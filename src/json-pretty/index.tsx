import { useState } from "react";
import { Link } from "react-router-dom";

export default function JsonPretty() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [minify, setMinify] = useState(false);

	const format = () => {
		try {
			const parsed = JSON.parse(input);
			setError("");
			setOutput(
				minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2),
			);
		} catch (e) {
			setError((e as Error).message);
			setOutput("");
		}
	};

	const copy = () => output && navigator.clipboard.writeText(output);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>JSON Pretty</h1>
				<p>Format & validate JSON</p>
			</div>
			<div className="controls">
				<button onClick={format}>Format</button>
				<button
					onClick={() => setMinify(!minify)}
					className={minify ? "active" : ""}
				>
					{minify ? "Minify" : "Pretty"}
				</button>
				<button onClick={copy}>Copy</button>
			</div>
			<div className="editor-grid">
				<div className="editor-panel">
					<span className="panel-label">Input</span>
					<textarea
						placeholder="Paste JSON here..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>
				<div className="editor-panel">
					<span className="panel-label">Output</span>
					<textarea
						readOnly
						value={output}
						placeholder="Formatted JSON will appear here..."
					/>
				</div>
			</div>
			{error && <div className="error-box">Error: {error}</div>}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'JetBrains Mono', monospace; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #f093fb, #f5576c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .controls { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .controls button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; color: white; cursor: pointer; font-size: 0.85rem; font-family: system-ui; }
        .controls button.active { background: #f5576c; border-color: #f5576c; }
        .editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .editor-panel { display: flex; flex-direction: column; }
        .panel-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; text-transform: uppercase; }
        .editor-panel textarea { flex: 1; min-height: 300px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #a8ff78; font-size: 0.85rem; line-height: 1.5; resize: none; }
        .editor-panel textarea:placeholder { color: rgba(255,255,255,0.3); }
        .error-box { margin-top: 1rem; padding: 0.75rem; background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3); border-radius: 0.5rem; color: #e74c3c; font-size: 0.85rem; }
        @media (max-width: 768px) { .editor-grid { grid-template-columns: 1fr; } }
      `}</style>
		</div>
	);
}
