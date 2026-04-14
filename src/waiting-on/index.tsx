import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Waiting {
	id: number;
	what: string;
	who: string;
	followUpDate?: string;
	note: string;
}

export default function WaitingOn() {
	const [items, setItems] = useState<Waiting[]>(() => {
		const saved = localStorage.getItem("waiting-on");
		return saved ? JSON.parse(saved) : [];
	});
	const [newItem, setNewItem] = useState({ what: "", who: "", note: "" });

	useEffect(() => {
		localStorage.setItem("waiting-on", JSON.stringify(items));
	}, [items]);

	const add = () => {
		if (!newItem.what.trim()) return;
		setItems([...items, { id: Date.now(), ...newItem }]);
		setNewItem({ what: "", who: "", note: "" });
	};
	const update = (id: number, field: keyof Waiting, value: string) =>
		setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
	const deleteItem = (id: number) => setItems(items.filter((i) => i.id !== id));

	const overdue = items.filter(
		(i) => i.followUpDate && new Date(i.followUpDate) < new Date(),
	);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#fef2f2",
				color: "#1f2937",
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
					color: "rgba(31,41,55,0.5)",
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
					Waiting On
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track things you're waiting for
				</p>

				{overdue.length > 0 && (
					<div
						style={{
							background: "#fecaca",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
						}}
					>
						<p style={{ margin: 0, fontWeight: "bold", color: "#991b1b" }}>
							⚠️ {overdue.length} overdue follow-ups
						</p>
					</div>
				)}

				<div
					style={{
						background: "white",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
					}}
				>
					<input
						type="text"
						value={newItem.what}
						onChange={(e) => setNewItem({ ...newItem, what: e.target.value })}
						placeholder="What are you waiting for?"
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "1px solid #fecaca",
							marginBottom: "0.5rem",
						}}
					/>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
					>
						<input
							type="text"
							value={newItem.who}
							onChange={(e) => setNewItem({ ...newItem, who: e.target.value })}
							placeholder="Who?"
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #fecaca",
							}}
						/>
						<input
							type="date"
							value={newItem.followUpDate || ""}
							onChange={(e) =>
								setNewItem({ ...newItem, followUpDate: e.target.value })
							}
							style={{
								flex: 1,
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #fecaca",
							}}
						/>
					</div>
					<button
						onClick={add}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#ef4444",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Add
					</button>
				</div>

				{items.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>Nothing waiting</p>
				)}
				{items.map((item) => (
					<div
						key={item.id}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
							borderLeft:
								item.followUpDate && new Date(item.followUpDate) < new Date()
									? "4px solid #ef4444"
									: "4px solid #fecaca",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<p style={{ margin: 0, fontWeight: "bold" }}>{item.what}</p>
								<p
									style={{
										margin: "0.25rem 0",
										fontSize: "0.85rem",
										opacity: 0.6,
									}}
								>
									Waiting on: {item.who}
								</p>
							</div>
							<button
								onClick={() => deleteItem(item.id)}
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
						<input
							type="date"
							value={item.followUpDate || ""}
							onChange={(e) => update(item.id, "followUpDate", e.target.value)}
							style={{
								width: "100%",
								padding: "0.5rem",
								borderRadius: 6,
								border: "1px solid #fecaca",
								marginTop: "0.5rem",
								fontSize: "0.85rem",
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
