import { useState } from "react";
import { Link } from "react-router-dom";

export default function BaseEncode() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [urlSafe, setUrlSafe] = useState(false);

	const process = () => {
		try {
			if (mode === "encode") {
				const encoded = btoa(unescape(encodeURIComponent(input)));
				setOutput(
					urlSafe
						? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
						: encoded,
				);
			} else {
				let decoded = input;
				if (urlSafe) {
					decoded = decoded.replace(/-/g, "+").replace(/_/g, "/");
					while (decoded.length % 4) decoded += "=";
				}
				setOutput(decodeURIComponent(escape(atob(decoded))));
			}
		} catch {
			setOutput("Error: Invalid input");
		}
	};

	const swap = () => {
		setInput(output);
		setOutput("");
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Base Encode</h1>
				<p>Encode & decode Base64</p>
			</div>
			<div className="mode-toggle">
				<button
					className={mode === "encode" ? "active" : ""}
					onClick={() => setMode("encode")}
				>
					Encode
				</button>
				<button
					className={mode === "decode" ? "active" : ""}
					onClick={() => setMode("decode")}
				>
					Decode
				</button>
			</div>
			<label className="url-safe">
				<input
					type="checkbox"
					checked={urlSafe}
					onChange={() => setUrlSafe(!urlSafe)}
				/>{" "}
				URL-safe
			</label>
			<div className="textarea-section">
				<textarea
					placeholder={
						mode === "encode" ? "Text to encode..." : "Base64 to decode..."
					}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button className="process-btn" onClick={process}>
					{mode === "encode" ? "Encode" : "Decode"}
				</button>
				<textarea readOnly placeholder="Result..." value={output} />
			</div>
			<button className="swap-btn" onClick={swap}>
				↑ Swap Input/Output
			</button>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'JetBrains Mono', monospace; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #a8edea, #fed6e3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .mode-toggle { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
        .mode-toggle button { flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; cursor: pointer; }
        .mode-toggle button.active { background: #a8edea; color: #0f0c29; font-weight: 600; }
        .url-safe { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; color: rgba(255,255,255,0.6); }
        .url-safe input { accent-color: #a8edea; }
        .textarea-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .textarea-section textarea { width: 100%; min-height: 100px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; font-size: 0.9rem; box-sizing: border-box; }
        .process-btn { padding: 0.75rem; background: linear-gradient(135deg, #a8edea, #fed6e3); border: none; border-radius: 0.5rem; color: #0f0c29; font-weight: 600; cursor: pointer; }
        .swap-btn { width: 100%; margin-top: 1rem; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; cursor: pointer; font-size: 0.85rem; }
      `}</style>
		</div>
	);
}
