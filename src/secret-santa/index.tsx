import { useState } from "react";
import { Link } from "react-router-dom";

export default function SecretSanta() {
	const [names, setNames] = useState<string[]>([]);
	const [newName, setNewName] = useState("");
	const [assignments, setAssignments] = useState<Record<string, string> | null>(
		null,
	);
	const [constraints, setConstraints] = useState<string[]>([]);

	const addName = () => {
		if (newName.trim()) {
			setNames([...names, newName.trim()]);
			setNewName("");
		}
	};
	const removeName = (n: string) => setNames(names.filter((x) => x !== n));

	const shuffle = () => {
		if (names.length < 2) return;
		let shuffled = [...names];
		let attempts = 0;
		while (attempts < 100) {
			shuffled = shuffled.sort(() => Math.random() - 0.5);
			let valid = true;
			for (let i = 0; i < shuffled.length; i++) {
				if (shuffled[i] === names[i]) {
					valid = false;
					break;
				}
			}
			if (valid) break;
			attempts++;
		}
		const result: Record<string, string> = {};
		names.forEach((name, i) => {
			result[name] = shuffled[i];
		});
		setAssignments(result);
	};

	const copyEmail = (giver: string, receiver: string) => {
		const text = `Hi! You've been selected for Secret Santa! 🎁\n\nYou will be giving a gift to: ${receiver}\n\nHappy gifting!`;
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Secret Santa</h1>
				<p>Gift exchange organizer</p>
			</div>
			<div className="input-row">
				<input
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addName()}
					placeholder="Add participant name..."
				/>
				<button onClick={addName}>Add</button>
			</div>
			<div className="names-list">
				{names.map((name) => (
					<div key={name} className="name-tag">
						<span>{name}</span>
						<button onClick={() => removeName(name)}>×</button>
					</div>
				))}
			</div>
			{names.length >= 2 && (
				<button className="generate-btn" onClick={shuffle}>
					Generate Assignments
				</button>
			)}
			{assignments && (
				<div className="results">
					<h3>Assignments</h3>
					{Object.entries(assignments).map(([giver, receiver]) => (
						<div key={giver} className="assignment">
							<span className="giver">{giver}</span>
							<span className="arrow">→</span>
							<span className="receiver">{receiver}</span>
							<button onClick={() => copyEmail(giver, receiver)}>📧</button>
						</div>
					))}
				</div>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #c0392b 0%, #8e44ad 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        .input-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .input-row input { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 0.5rem; color: white; }
        .input-row button { padding: 0.75rem 1.25rem; background: white; border: none; border-radius: 0.5rem; color: #c0392b; font-weight: 600; cursor: pointer; }
        .names-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .name-tag { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.15); border-radius: 1.5rem; }
        .name-tag button { background: none; border: none; color: white; cursor: pointer; font-size: 1rem; opacity: 0.7; }
        .generate-btn { width: 100%; padding: 1rem; background: white; border: none; border-radius: 0.75rem; color: #c0392b; font-weight: 700; font-size: 1rem; cursor: pointer; }
        .results { margin-top: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 1rem; padding: 1rem; }
        .results h3 { margin: 0 0 1rem; font-size: 0.9rem; color: rgba(255,255,255,0.8); }
        .assignment { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem; margin-bottom: 0.5rem; }
        .assignment .giver { font-weight: 600; }
        .assignment .arrow { color: rgba(255,255,255,0.5); }
        .assignment .receiver { flex: 1; }
        .assignment button { background: none; border: none; font-size: 1.1rem; cursor: pointer; }
      `}</style>
		</div>
	);
}
