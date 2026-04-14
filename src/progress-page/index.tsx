import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Widget {
	id: number;
	type: "habit" | "water" | "sleep" | "mood" | "custom";
	name: string;
	goal?: number;
	current?: number;
}

export default function ProgressPage() {
	const [widgets, setWidgets] = useState<Widget[]>(() => {
		const saved = localStorage.getItem("progress-widgets");
		return saved ? JSON.parse(saved) : [
			{ id: 1, type: "habit", name: "Morning Routine", current: 3, goal: 5 },
			{ id: 2, type: "water", name: "Water Intake", current: 4, goal: 8 },
			{ id: 3, type: "sleep", name: "Sleep Hours", current: 7, goal: 8 },
			{ id: 4, type: "mood", name: "Mood Score", current: 7, goal: 10 },
		];
	});

	useEffect(() => { localStorage.setItem("progress-widgets", JSON.stringify(widgets)); }, [widgets]);

	const updateWidget = (id: number, delta: number) => {
		setWidgets(widgets.map(w => w.id === id ? { ...w, current: Math.max(0, (w.current || 0) + delta) } : w));
	};

	return (
		<div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "2rem", fontFamily: "system-ui" }}>
			<Link to="/" style={{ position: "fixed", top: "1rem", left: "1rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← Gallery</Link>
			<div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "2rem" }}>
				<h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "0.5rem" }}>Progress Page</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>Your personal dashboard</p>

				<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
					{widgets.map(widget => {
						const progress = widget.goal ? ((widget.current || 0) / widget.goal! * 100) : 0;
						const colors: Record<string, string> = { habit: "#22c55e", water: "#3b82f6", sleep: "#8b5cf6", mood: "#f59e0b", custom: "#ec4899" };
						const icons: Record<string, string> = { habit: "✓", water: "💧", sleep: "😴", mood: "😊", custom: "★" };
						return (
							<div key={widget.id} style={{ background: "#1e293b", borderRadius: 16, padding: "1rem", minHeight: 150 }}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
									<span style={{ opacity: 0.6, fontSize: "0.85rem" }}>{widget.name}</span>
									<span style={{ fontSize: "1.2rem" }}>{icons[widget.type]}</span>
								</div>
								<div style={{ fontSize: "2rem", fontWeight: "bold", color: colors[widget.type] }}>{widget.current || 0}</div>
								{widget.goal && <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", opacity: 0.6" }}>of {widget.goal}</p>}
								<div style={{ height: 8, background: "#334155", borderRadius: 4, marginTop: "0.5rem", overflow: "hidden" }}>
									<div style={{ width: `${Math.min(100, progress)}%`, height: "100%", background: colors[widget.type], transition: "width 0.3s" }} />
								</div>
								<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
									<button onClick={() => updateWidget(widget.id, -1)} style={{ flex: 1, padding: "0.4rem", borderRadius: 6, border: "none", background: "#334155", color: "white", cursor: "pointer" }}>-1</button>
									<button onClick={() => updateWidget(widget.id, 1)} style={{ flex: 1, padding: "0.4rem", borderRadius: 6, border: "none", background: colors[widget.type], color: "white", cursor: "pointer" }}>+1</button>
								</div>
							</div>
						);
					})}
				</div>

				<AddWidgetForm onAdd={(w) => setWidgets([...widgets, { id: Date.now(), ...w }])} />
			</div>
		</div>
	);
}

function AddWidgetForm({ onAdd }: { onAdd: (w: Omit<Widget, "id">) => void }) {
	const [name, setName] = useState("");
	const [goal, setGoal] = useState(10);
	const [type, setType] = useState<Widget["type"]>("custom");
	return (
		<div style={{ marginTop: "1.5rem", background: "#1e293b", borderRadius: 12, padding: "1rem" }}>
			<input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Widget name" style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "none", background: "#0f172a", color: "white", marginBottom: "0.5rem" }} />
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
				<input type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} style={{ width: 80, padding: "0.5rem", borderRadius: 8, border: "none", background: "#0f172a", color: "white", textAlign: "center" }} />
				<select value={type} onChange={e => setType(e.target.value as Widget["type"])} style={{ flex: 1, padding: "0.5rem", borderRadius: 8, border: "none", background: "#0f172a", color: "white" }}>
					<option value="custom">Custom</option>
					<option value="habit">Habit</option>
					<option value="water">Water</option>
					<option value="sleep">Sleep</option>
					<option value="mood">Mood</option>
				</select>
			</div>
			<button onClick={() => { if (name) { onAdd({ type, name, goal, current: 0 }); setName(""); } }} style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", fontWeight: "bold", cursor: "pointer" }}>Add Widget</button>
		</div>
	);
}
