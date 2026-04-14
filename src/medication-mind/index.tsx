import { useState } from "react";
import { Link } from "react-router-dom";

interface Med {
	id: string;
	name: string;
	frequency: string;
	times: string[];
	doses: number;
	taken: number[];
}

export default function MedicationMind() {
	const [meds, setMeds] = useState<Med[]>([]);
	const [newMed, setNewMed] = useState({
		name: "",
		frequency: "daily",
		times: "",
		doses: "30",
	});

	const add = () => {
		if (!newMed.name) return;
		setMeds([
			...meds,
			{
				id: `m-${Date.now()}`,
				name: newMed.name,
				frequency: newMed.frequency,
				times: newMed.times.split(","),
				doses: parseInt(newMed.doses) || 30,
				taken: [],
			},
		]);
		setNewMed({ name: "", frequency: "daily", times: "", doses: "30" });
	};
	const log = (id: string, day: number) =>
		setMeds(
			meds.map((m) =>
				m.id === id
					? {
							...m,
							taken: m.taken.includes(day)
								? m.taken.filter((d) => d !== day)
								: [...m.taken, day],
						}
					: m,
			),
		);
	const remove = (id: string) => setMeds(meds.filter((m) => m.id !== id));

	const today = new Date();
	const dayOfYear = Math.floor(
		(today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
			86400000,
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Medication Mind</h1>
				<p>Track medications</p>
			</div>
			<div className="add-form">
				<input
					value={newMed.name}
					onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
					placeholder="Medication name"
				/>
				<select
					value={newMed.frequency}
					onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
				>
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
					<option value="asneeded">As needed</option>
				</select>
				<input
					value={newMed.times}
					onChange={(e) => setNewMed({ ...newMed, times: e.target.value })}
					placeholder="Times (e.g. 8am, 8pm)"
				/>
				<input
					value={newMed.doses}
					onChange={(e) => setNewMed({ ...newMed, doses: e.target.value })}
					placeholder="Doses remaining"
					type="number"
				/>
				<button onClick={add}>Add Medication</button>
			</div>
			<div className="meds-list">
				{meds.map((med) => {
					const adherence =
						med.taken.length > 0
							? Math.round((med.taken.length / 30) * 100)
							: 0;
					return (
						<div key={med.id} className="med-card">
							<div className="med-header">
								<h3>{med.name}</h3>
								<button onClick={() => remove(med.id)}>×</button>
							</div>
							<p className="med-info">
								{med.frequency} • {med.times.join(", ")}
							</p>
							<div className="med-stats">
								<span>{med.doses} doses left</span>
								<span className="adherence">{adherence}% adherence</span>
							</div>
							<button
								className="log-btn"
								onClick={() => log(med.id, dayOfYear)}
							>
								{med.taken.includes(dayOfYear) ? "✓ Taken today" : "Log dose"}
							</button>
						</div>
					);
				})}
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #11998e 0%, #38ef7d 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.8); font-size: 0.9rem; }
        .add-form { background: rgba(255,255,255,0.15); border-radius: 1rem; padding: 1rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .add-form input, .add-form select { padding: 0.7rem; background: rgba(255,255,255,0.2); border: none; border-radius: 0.5rem; color: white; }
        .add-form input::placeholder { color: rgba(255,255,255,0.6); }
        .add-form button { padding: 0.8rem; background: white; border: none; border-radius: 0.5rem; color: #11998e; font-weight: 600; cursor: pointer; }
        .meds-list { display: flex; flex-direction: column; gap: 1rem; }
        .med-card { background: rgba(255,255,255,0.15); border-radius: 1rem; padding: 1rem; }
        .med-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
        .med-header h3 { margin: 0; font-size: 1.1rem; }
        .med-header button { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; opacity: 0.6; }
        .med-info { margin: 0 0 0.5rem; font-size: 0.85rem; opacity: 0.8; }
        .med-stats { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.85rem; }
        .adherence { color: #38ef7d; font-weight: 600; }
        .log-btn { width: 100%; padding: 0.7rem; background: white; border: none; border-radius: 0.5rem; color: #11998e; font-weight: 600; cursor: pointer; }
      `}</style>
		</div>
	);
}
