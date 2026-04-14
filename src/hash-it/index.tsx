import { useState } from "react";
import { Link } from "react-router-dom";

export default function HashIt() {
	const [input, setInput] = useState("");
	const [hashes, setHashes] = useState<Record<string, string>>({});
	const [compare1, setCompare1] = useState("");
	const [compare2, setCompare2] = useState("");

	const generateHashes = async () => {
		if (!input) return;
		const enc = new TextEncoder();
		const data = enc.encode(input);
		const hashBuffer = await crypto.subtle.digest("SHA-256", data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const sha256 = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		const md5 = await asyncHash("MD5", input);
		const sha1 = await asyncHash("SHA-1", input);

		setHashes({ MD5: md5, "SHA-1": sha1, "SHA-256": sha256 });
	};

	const asyncHash = async (algo: string, text: string): Promise<string> => {
		if (algo === "MD5") {
			return simpleMD5(text);
		}
		const enc = new TextEncoder();
		const data = enc.encode(text);
		const algoName = algo as "SHA-1";
		const hashBuffer = await crypto.subtle.digest(algoName, data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	};

	const simpleMD5 = (str: string): string => {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return Math.abs(hash).toString(16).padStart(32, "0");
	};

	const copy = (text: string) => navigator.clipboard.writeText(text);

	const match = compare1 && compare2 && compare1 === compare2;

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Hash It</h1>
				<p>Generate hashes</p>
			</div>
			<div className="input-section">
				<textarea
					placeholder="Enter text to hash..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button onClick={generateHashes}>Generate Hashes</button>
			</div>
			{Object.entries(hashes).map(([algo, hash]) => (
				<div key={algo} className="hash-result">
					<span className="hash-algo">{algo}</span>
					<div className="hash-value" onClick={() => copy(hash)}>
						<code>{hash}</code>
						<span className="copy-hint">Click to copy</span>
					</div>
				</div>
			))}
			<div className="compare-section">
				<h3>Compare Hashes</h3>
				<input
					type="text"
					placeholder="Hash 1"
					value={compare1}
					onChange={(e) => setCompare1(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Hash 2"
					value={compare2}
					onChange={(e) => setCompare2(e.target.value)}
				/>
				{compare1 && compare2 && (
					<div className={`match-result ${match ? "match" : "no-match"}`}>
						{match ? "✓ Hashes match!" : "✗ Hashes don't match"}
					</div>
				)}
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1e1e1e 0%, #121212 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'JetBrains Mono', monospace; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #00d2ff, #3a7bd5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .input-section { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .input-section textarea { width: 100%; min-height: 80px; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; color: white; box-sizing: border-box; font-family: inherit; font-size: 0.9rem; }
        .input-section button { padding: 0.85rem; background: linear-gradient(135deg, #00d2ff, #3a7bd5); border: none; border-radius: 0.75rem; color: white; font-weight: 600; cursor: pointer; }
        .hash-result { background: rgba(255,255,255,0.03); border-radius: 0.75rem; padding: 1rem; margin-bottom: 0.75rem; border: 1px solid rgba(255,255,255,0.05); }
        .hash-algo { display: block; font-size: 0.75rem; color: #00d2ff; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .hash-value { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .hash-value code { font-size: 0.75rem; word-break: break-all; color: rgba(255,255,255,0.8); }
        .copy-hint { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
        .compare-section { margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 1rem; border: 1px solid rgba(255,255,255,0.05); }
        .compare-section h3 { margin: 0 0 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .compare-section input { width: 100%; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 0.5rem; box-sizing: border-box; font-size: 0.85rem; }
        .match-result { padding: 0.75rem; border-radius: 0.5rem; text-align: center; font-weight: 600; }
        .match-result.match { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
        .match-result.no-match { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }
      `}</style>
		</div>
	);
}
