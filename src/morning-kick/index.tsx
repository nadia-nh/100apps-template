import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface RoutineItem {
	id: number;
	name: string;
	completed: boolean;
}

export default function MorningKick() {
	const [items, setItems] = useState<RoutineItem[]>(() => {
		const saved = localStorage.getItem("morning-items");
		return saved
			? JSON.parse(saved)
			: [
					{ id: 1, name: "Drink water", completed: false },
					{ id: 2, name: "Stretch", completed: false },
					{ id: 3, name: "Review goals", completed: false },
				];
	});
	const today = new Date().toISOString().split("T")[0];
	const [history, setHistory] = useState<Record<string, boolean>>(() => {
		const saved = localStorage.getItem("morning-history");
		return saved ? JSON.parse(saved) : {};
	});

	useEffect(() => {
		localStorage.setItem("morning-items", JSON.stringify(items));
		localStorage.setItem("morning-history", JSON.stringify(history));
	}, [items, history]);

	const toggle = (id: number) =>
		setItems(
			items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
		);
	const completeAll = () => {
		setHistory({ ...history, [today]: true });
		setItems(items.map((i) => ({ ...i, completed: false })));
	};
	const completed = items.filter((i) => i.completed).length;
	const allDone = completed === items.length;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
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
					color: "rgba(255,255,255,0.7)",
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>
			<div style={{ maxWidth: 500, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					Morning Kick
				</h1>
				<p style={{ textAlign: "center", opacity: 0.7, marginBottom: "2rem" }}>
					Morning routine
				</p>
				<div
					style={{
						background: "rgba(255,255,255,0.15)",
						borderRadius: 16,
						padding: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							gap: "0.5rem",
							marginBottom: "1rem",
						}}
					>
						{[...Array(items.length)].map((_, i) => (
							<div
								key={i}
								style={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									background: i < completed ? "#fff" : "rgba(255,255,255,0.3)",
								}}
							/>
						))}
					</div>
					<p style={{ textAlign: "center", margin: 0 }}>
						{completed} / {items.length}
					</p>
				</div>
				{items.map((item) => (
					<div
						key={item.id}
						onClick={() => toggle(item.id)}
						style={{
							background: item.completed
								? "rgba(255,255,255,0.25)"
								: "rgba(255,255,255,0.1)",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
							cursor: "pointer",
						}}
					>
						<div
							style={{
								width: 24,
								height: 24,
								borderRadius: "50%",
								border: `2px solid ${item.completed ? "#fff" : "rgba(255,255,255,0.5)"}`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{item.completed && "✓"}
						</div>
						<span
							style={{
								textDecoration: item.completed ? "line-through" : "none",
							}}
						>
							{item.name}
						</span>
					</div>
				))}
				{allDone && (
					<button
						onClick={completeAll}
						style={{
							width: "100%",
							padding: "1rem",
							borderRadius: 12,
							border: "none",
							background: "#fff",
							color: "#f97316",
							fontWeight: "bold",
							cursor: "pointer",
							marginTop: "1rem",
						}}
					>
						Done for Today!
					</button>
				)}
				<EditItems items={items} setItems={setItems} />
			</div>
		</div>
	);
}

function EditItems({
	items,
	setItems,
}: {
	items: RoutineItem[];
	setItems: (items: RoutineItem[]) => void;
}) {
	const [newItem, setNewItem] = useState("");
	const addItem = () => {
		if (!newItem.trim()) return;
		setItems([...items, { id: Date.now(), name: newItem, completed: false }]);
		setNewItem("");
	};
	return (
		<div
			style={{
				marginTop: "2rem",
				padding: "1rem",
				background: "rgba(255,255,255,0.1)",
				borderRadius: 12,
			}}
		>
			<p style={{ opacity: 0.7, marginBottom: "0.5rem" }}>Edit items:</p>
			<div style={{ display: "flex", gap: "0.5rem" }}>
				<input
					type="text"
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
					style={{
						flex: 1,
						padding: "0.5rem",
						borderRadius: 8,
						border: "none",
						background: "rgba(255,255,255,0.2)",
						color: "white",
					}}
				/>
				<button
					onClick={addItem}
					style={{
						padding: "0.5rem 1rem",
						borderRadius: 8,
						border: "none",
						background: "#fff",
						color: "#f97316",
						cursor: "pointer",
					}}
				>
					+
				</button>
			</div>
			{items.map((i) => (
				<div
					key={i.id}
					style={{
						display: "flex",
						justifyContent: "space-between",
						padding: "0.5rem",
						borderBottom: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					<span style={{ opacity: 0.7 }}>{i.name}</span>
					<button
						onClick={() => setItems(items.filter((x) => x.id !== i.id))}
						style={{
							background: "none",
							border: "none",
							color: "#ef4444",
							cursor: "pointer",
						}}
					>
						×
					</button>
				</div>
			))}
		</div>
	);
}
