import { useState } from "react";
import { Link } from "react-router-dom";

const palettes = [
	{
		name: "Sunset",
		colors: ["#ff6b6b", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"],
	},
	{
		name: "Ocean",
		colors: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#03045e"],
	},
	{
		name: "Forest",
		colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2"],
	},
	{
		name: "Berry",
		colors: ["#590d22", "#800f2f", "#a4133c", "#c9184a", "#ff4d6d"],
	},
	{
		name: "Lavender",
		colors: ["#7400b8", "#6930c3", "#5e60ce", "#5390d9", "#4ea8de"],
	},
	{
		name: "Candy",
		colors: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"],
	},
];

export default function PalettePick() {
	const [colors, setColors] = useState<string[]>(
		palettes[Math.floor(Math.random() * palettes.length)].colors,
	);
	const [locked, setLocked] = useState<boolean[]>([
		false,
		false,
		false,
		false,
		false,
	]);

	const generatePalette = () => {
		const newColors = colors.map((c, i) => {
			if (locked[i]) return c;
			const h = Math.floor(Math.random() * 360);
			const s = 50 + Math.floor(Math.random() * 40);
			const l = 40 + Math.floor(Math.random() * 30);
			return `hsl(${h}, ${s}%, ${l}%)`;
		});
		setColors(newColors);
	};

	const copyColor = (color: string, format: "hex" | "rgb" | "hsl" = "hex") => {
		let text = color;
		if (format === "rgb") {
			const hsl = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
			if (hsl) {
				const h = parseInt(hsl[1]),
					s = parseInt(hsl[2]) / 100,
					l = parseInt(hsl[3]) / 100;
				const rgb = [
					Math.round(l * 255),
					Math.round((l - (l * s) / 2) * 255),
					Math.round((l - (l * s) / 2) * 255),
				];
				const i = Math.floor(h / 60) % 6;
				const f = h / 60 - i;
				const v = l + l * s * Math.max(Math.min(f, 1 - f, 1), 0) - l;
				text = `rgb(${Math.round(v * 255)},${Math.round((l + l * s * (Math.min(f, 1 - f, 1) - 0.5)) * 255)},${Math.round(l * 255)})`;
			}
		}
		navigator.clipboard.writeText(text);
	};

	const savePalette = () => {
		const saved = JSON.parse(localStorage.getItem("saved-palettes") || "[]");
		saved.push({ colors, date: new Date().toISOString() });
		localStorage.setItem("saved-palettes", JSON.stringify(saved));
	};

	const savedPalettes = JSON.parse(
		localStorage.getItem("saved-palettes") || "[]",
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Palette Pick</h1>
				<p>Generate color palettes</p>
			</div>
			<div className="palette-display">
				{colors.map((color, i) => (
					<div key={i} className="color-column" style={{ background: color }}>
						<button
							className={`lock-btn ${locked[i] ? "locked" : ""}`}
							onClick={() =>
								setLocked(locked.map((l, j) => (j === i ? !l : l)))
							}
						>
							{locked[i] ? "🔒" : "🔓"}
						</button>
						<div className="color-info" onClick={() => copyColor(color)}>
							<span className="color-hex">{color}</span>
							<span className="copy-hint">Click to copy</span>
						</div>
					</div>
				))}
			</div>
			<div className="actions">
				<button className="generate-btn" onClick={generatePalette}>
					Generate New
				</button>
				<button className="save-btn" onClick={savePalette}>
					Save Palette
				</button>
			</div>
			{savedPalettes.length > 0 && (
				<div className="saved-section">
					<h3>Saved Palettes</h3>
					<div className="saved-list">
						{savedPalettes
							.slice(-5)
							.reverse()
							.map((p: string[], i: number) => (
								<div
									key={i}
									className="saved-palette"
									onClick={() => setColors(p)}
								>
									{p.map((c, j) => (
										<div
											key={j}
											className="saved-color"
											style={{ background: c }}
										/>
									))}
								</div>
							))}
					</div>
				</div>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: #0d0d0d; color: #e8e8e8; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { position: fixed; top: 1.5rem; right: 1.5rem; text-align: right; z-index: 10; }
        .header h1 { font-size: 1.5rem; margin: 0; background: linear-gradient(90deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.8rem; }
        .palette-display { display: flex; height: 60vh; margin-bottom: 1rem; }
        .color-column { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding: 1rem; transition: all 0.2s; position: relative; }
        .color-column:hover { flex: 1.2; }
        .lock-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.3); border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.2rem; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
        .color-column:hover .lock-btn { opacity: 1; }
        .lock-btn.locked { opacity: 1; background: rgba(0,0,0,0.5); }
        .color-info { text-align: center; cursor: pointer; }
        .color-hex { display: block; font-weight: 600; font-size: 0.9rem; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
        .copy-hint { font-size: 0.7rem; opacity: 0; transition: opacity 0.2s; color: rgba(255,255,255,0.8); }
        .color-info:hover .copy-hint { opacity: 1; }
        .actions { display: flex; gap: 0.75rem; padding: 0 1rem; }
        .actions button { flex: 1; padding: 0.85rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; border: none; font-size: 0.9rem; }
        .generate-btn { background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; }
        .save-btn { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .saved-section { padding: 1rem; margin-top: 1rem; }
        .saved-section h3 { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        .saved-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .saved-palette { display: flex; height: 30px; border-radius: 0.5rem; overflow: hidden; cursor: pointer; }
        .saved-color { flex: 1; }
      `}</style>
		</div>
	);
}
