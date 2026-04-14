import { useState } from "react";
import { Link } from "react-router-dom";

const categories = {
	length: {
		name: "Length",
		units: ["m", "km", "cm", "mm", "mi", "ft", "in", "yd"],
		factors: [1, 1000, 0.01, 0.001, 1609.34, 0.3048, 0.0254, 0.9144],
	},
	weight: {
		name: "Weight",
		units: ["kg", "g", "mg", "lb", "oz"],
		factors: [1, 0.001, 0.000001, 0.453592, 0.0283495],
	},
	temperature: { name: "Temperature", units: ["°C", "°F", "K"], special: true },
	data: {
		name: "Data",
		units: ["B", "KB", "MB", "GB", "TB"],
		factors: [1, 1024, 1024 ** 2, 1024 ** 3, 1024 ** 4],
	},
	time: {
		name: "Time",
		units: ["s", "min", "h", "day", "week"],
		factors: [1, 60, 3600, 86400, 604800],
	},
};

export default function UnitConvert() {
	const [category, setCategory] = useState<keyof typeof categories>("length");
	const [value, setValue] = useState("1");
	const [fromUnit, setFromUnit] = useState(0);
	const [toUnit, setToUnit] = useState(1);

	const convert = () => {
		const val = parseFloat(value);
		if (isNaN(val)) return null;
		const cat = categories[category];
		if (cat.special) {
			let celsius = val;
			if (cat.units[fromUnit] === "°F") celsius = ((val - 32) * 5) / 9;
			if (cat.units[fromUnit] === "K") celsius = val - 273.15;
			let result = celsius;
			if (cat.units[toUnit] === "°F") result = (celsius * 9) / 5 + 32;
			if (cat.units[toUnit] === "K") result = celsius + 273.15;
			return result;
		}
		const inBase = val * cat.factors[fromUnit];
		return inBase / cat.factors[toUnit];
	};

	const result = convert();
	const swap = () => {
		const t = fromUnit;
		setFromUnit(toUnit);
		setToUnit(t);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Unit Convert</h1>
				<p>Convert between units</p>
			</div>
			<div className="category-tabs">
				{Object.entries(categories).map(([k, v]) => (
					<button
						key={k}
						className={category === k ? "active" : ""}
						onClick={() => {
							setCategory(k as keyof typeof categories);
							setFromUnit(0);
							setToUnit(1);
						}}
					>
						{v.name}
					</button>
				))}
			</div>
			<div className="converter">
				<div className="input-group">
					<input
						type="number"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					<select
						value={fromUnit}
						onChange={(e) => setFromUnit(parseInt(e.target.value))}
					>
						{categories[category].units.map((u, i) => (
							<option key={i} value={i}>
								{u}
							</option>
						))}
					</select>
				</div>
				<button className="swap-btn" onClick={swap}>
					⇄
				</button>
				<div className="input-group">
					<input
						type="text"
						readOnly
						value={result?.toFixed(6).replace(/\.?0+$/, "") ?? ""}
					/>
					<select
						value={toUnit}
						onChange={(e) => setToUnit(parseInt(e.target.value))}
					>
						{categories[category].units.map((u, i) => (
							<option key={i} value={i}>
								{u}
							</option>
						))}
					</select>
				</div>
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #134e5e 0%, #71b280 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #fff, #c3cfe2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.6); font-size: 0.9rem; }
        .category-tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem; justify-content: center; }
        .category-tabs button { padding: 0.5rem 0.85rem; background: rgba(255,255,255,0.1); border: none; border-radius: 1.5rem; color: white; cursor: pointer; font-size: 0.85rem; }
        .category-tabs button.active { background: white; color: #134e5e; font-weight: 600; }
        .converter { display: flex; align-items: center; gap: 0.75rem; justify-content: center; }
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group input { padding: 1rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 0.75rem; color: white; font-size: 1.25rem; width: 140px; text-align: center; }
        .input-group select { padding: 0.6rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 0.5rem; color: white; text-align: center; }
        .swap-btn { width: 40px; height: 40px; background: rgba(255,255,255,0.15); border: none; border-radius: 50%; color: white; cursor: pointer; font-size: 1.2rem; }
      `}</style>
		</div>
	);
}
