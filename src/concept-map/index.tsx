import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Concept {
	id: number;
	name: string;
	x: number;
	y: number;
	color: string;
}

interface Relation {
	from: number;
	to: number;
}

export default function ConceptMap() {
	const [concepts, setConcepts] = useState<Concept[]>(() => {
		const saved = localStorage.getItem("concepts");
		return saved ? JSON.parse(saved) : [];
	});
	const [relations, setRelations] = useState<Relation[]>(() => {
		const saved = localStorage.getItem("relations");
		return saved ? JSON.parse(saved) : [];
	});
	const [dragging, setDragging] = useState<number | null>(null);

	useEffect(() => {
		localStorage.setItem("concepts", JSON.stringify(concepts));
		localStorage.setItem("relations", JSON.stringify(relations));
	}, [concepts, relations]);

	const colors = [
		"#ef4444",
		"#f59e0b",
		"#22c55e",
		"#3b82f6",
		"#8b5cf6",
		"#ec4899",
	];
	const addConcept = (name: string) =>
		setConcepts([
			...concepts,
			{
				id: Date.now(),
				name,
				x: 150 + Math.random() * 200,
				y: 150 + Math.random() * 200,
				color: colors[concepts.length % colors.length],
			},
		]);
	const addRelation = (from: number, to: number) => {
		if (from !== to && !relations.find((r) => r.from === from && r.to === to))
			setRelations([...relations, { from, to }]);
	};

	const handleDrag = (e: React.MouseEvent, id: number) => {
		if (dragging === null) return;
		const rect = e.currentTarget.parentElement?.getBoundingClientRect();
		if (!rect) return;
		setConcepts(
			concepts.map((c) =>
				c.id === id
					? {
							...c,
							x: e.clientX - rect.left - 50,
							y: e.clientY - rect.top - 20,
						}
					: c,
			),
		);
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e1e1e",
				color: "white",
				padding: "2rem",
				fontFamily: "system-ui",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(255,255,255,0.5)",
					textDecoration: "none",
					zIndex: 100,
				}}
			>
				← Gallery
			</Link>
			<div style={{ maxWidth: 800, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.5rem",
						textAlign: "center",
						marginBottom: "1rem",
					}}
				>
					Concept Map
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "1rem" }}>
					Visualize connected concepts
				</p>

				<AddConceptForm onAdd={addConcept} />

				<div
					style={{
						position: "relative",
						height: 400,
						background: "#252525",
						borderRadius: 16,
						marginTop: "1rem",
						overflow: "hidden",
					}}
				>
					{relations.map((r, i) => {
						const from = concepts.find((c) => c.id === r.from);
						const to = concepts.find((c) => c.id === r.to);
						if (!from || !to) return null;
						return (
							<svg
								key={i}
								style={{
									position: "absolute",
									inset: 0,
									pointerEvents: "none",
								}}
							>
								<line
									x1={from.x + 40}
									y1={from.y + 15}
									x2={to.x + 40}
									y2={to.y + 15}
									stroke="#666"
									strokeWidth={2}
								/>
							</svg>
						);
					})}
					{concepts.map((c) => (
						<div
							key={c.id}
							draggable
							onDragStart={() => setDragging(c.id)}
							onDrag={(e) => handleDrag(e, c.id)}
							onDragEnd={() => setDragging(null)}
							style={{
								position: "absolute",
								left: c.x,
								top: c.y,
								background: c.color,
								padding: "0.5rem 1rem",
								borderRadius: 8,
								cursor: "grab",
								fontWeight: "bold",
							}}
						>
							{c.name}
						</div>
					))}
				</div>

				{concepts.length >= 2 && (
					<RelationForm concepts={concepts} onAdd={addRelation} />
				)}
			</div>
		</div>
	);
}

function AddConceptForm({ onAdd }: { onAdd: (name: string) => void }) {
	const [name, setName] = useState("");
	return (
		<div style={{ display: "flex", gap: "0.5rem" }}>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Concept name"
				style={{
					flex: 1,
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#333",
					color: "white",
				}}
			/>
			<button
				onClick={() => {
					if (name) {
						onAdd(name);
						setName("");
					}
				}}
				style={{
					padding: "0.75rem 1.5rem",
					borderRadius: 8,
					border: "none",
					background: "#3b82f6",
					color: "white",
					cursor: "pointer",
				}}
			>
				Add
			</button>
		</div>
	);
}

function RelationForm({
	concepts,
	onAdd,
}: {
	concepts: Concept[];
	onAdd: (from: number, to: number) => void;
}) {
	const [from, setFrom] = useState(concepts[0]?.id.toString() || "");
	const [to, setTo] = useState(concepts[1]?.id.toString() || "");
	return (
		<div
			style={{
				marginTop: "1rem",
				display: "flex",
				gap: "0.5rem",
				alignItems: "center",
			}}
		>
			<select
				value={from}
				onChange={(e) => setFrom(e.target.value)}
				style={{
					flex: 1,
					padding: "0.5rem",
					borderRadius: 8,
					border: "none",
					background: "#333",
					color: "white",
				}}
			>
				{concepts.map((c) => (
					<option key={c.id} value={c.id}>
						{c.name}
					</option>
				))}
			</select>
			<span>→</span>
			<select
				value={to}
				onChange={(e) => setTo(e.target.value)}
				style={{
					flex: 1,
					padding: "0.5rem",
					borderRadius: 8,
					border: "none",
					background: "#333",
					color: "white",
				}}
			>
				{concepts.map((c) => (
					<option key={c.id} value={c.id}>
						{c.name}
					</option>
				))}
			</select>
			<button
				onClick={() => {
					if (from && to) onAdd(Number(from), Number(to));
				}}
				style={{
					padding: "0.5rem 1rem",
					borderRadius: 8,
					border: "none",
					background: "#666",
					color: "white",
					cursor: "pointer",
				}}
			>
				Connect
			</button>
		</div>
	);
}
