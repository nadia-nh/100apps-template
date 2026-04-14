import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Bulb {
	id: number;
	location: string;
	type: string;
	quantity: number;
}

export default function LightStock() {
	const [bulbs, setBulbs] = useState<Bulb[]>(() => {
		const saved = localStorage.getItem("light-stock");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("light-stock", JSON.stringify(bulbs));
	}, [bulbs]);

	const addBulb = (location: string, type: string, quantity: number) => {
		setBulbs([...bulbs, { id: Date.now(), location, type, quantity }]);
	};

	const updateQuantity = (id: number, delta: number) => {
		setBulbs(
			bulbs.map((b) =>
				b.id === id ? { ...b, quantity: Math.max(0, b.quantity + delta) } : b,
			),
		);
	};

	const deleteBulb = (id: number) => {
		setBulbs(bulbs.filter((b) => b.id !== id));
	};

	const lowStock = bulbs.filter((b) => b.quantity <= 1);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#fefce8",
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
					Light Stock
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Light bulb inventory
				</p>

				<AddBulbForm onAdd={addBulb} />

				{lowStock.length > 0 && (
					<div
						style={{
							background: "#fde047",
							borderRadius: 12,
							padding: "1rem",
							marginTop: "1.5rem",
							marginBottom: "1.5rem",
						}}
					>
						<p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem" }}>
							⚠️ Low Stock
						</p>
						{lowStock.map((b) => (
							<p
								key={b.id}
								style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}
							>
								{b.location}: {b.type} ({b.quantity} left)
							</p>
						))}
					</div>
				)}

				{bulbs.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, marginTop: "1.5rem" }}>
						No bulbs tracked
					</p>
				)}

				{bulbs.map((b) => (
					<div
						key={b.id}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<div>
							<p style={{ margin: 0, fontWeight: "bold" }}>{b.location}</p>
							<p
								style={{
									margin: "0.25rem 0 0",
									fontSize: "0.8rem",
									opacity: 0.6,
								}}
							>
								{b.type}
							</p>
						</div>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<button
								onClick={() => updateQuantity(b.id, -1)}
								style={{
									width: 32,
									height: 32,
									borderRadius: 6,
									border: "none",
									background: "#fef9c3",
									color: "#ca8a04",
									fontSize: "1.2rem",
									cursor: "pointer",
								}}
							>
								-
							</button>
							<span
								style={{
									fontWeight: "bold",
									minWidth: 24,
									textAlign: "center",
								}}
							>
								{b.quantity}
							</span>
							<button
								onClick={() => updateQuantity(b.id, 1)}
								style={{
									width: 32,
									height: 32,
									borderRadius: 6,
									border: "none",
									background: "#fef9c3",
									color: "#ca8a04",
									fontSize: "1.2rem",
									cursor: "pointer",
								}}
							>
								+
							</button>
							<button
								onClick={() => deleteBulb(b.id)}
								style={{
									background: "none",
									border: "none",
									color: "#ef4444",
									cursor: "pointer",
									marginLeft: "0.5rem",
								}}
							>
								×
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function AddBulbForm({
	onAdd,
}: {
	onAdd: (location: string, type: string, qty: number) => void;
}) {
	const [location, setLocation] = useState("");
	const [type, setType] = useState("LED");
	const [qty, setQty] = useState(1);

	return (
		<div
			style={{
				background: "white",
				borderRadius: 12,
				padding: "1rem",
				boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
			}}
		>
			<input
				type="text"
				placeholder="Location (e.g., Living Room)"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #fef9c3",
					marginBottom: "0.5rem",
				}}
			/>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
				<select
					value={type}
					onChange={(e) => setType(e.target.value)}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "1px solid #fef9c3",
					}}
				>
					<option value="LED">LED</option>
					<option value="CFL">CFL</option>
					<option value="Incandescent">Incandescent</option>
					<option value="Halogen">Halogen</option>
				</select>
				<input
					type="number"
					min="1"
					value={qty}
					onChange={(e) => setQty(Number(e.target.value))}
					style={{
						width: 60,
						padding: "0.75rem",
						borderRadius: 8,
						border: "1px solid #fef9c3",
						textAlign: "center",
					}}
				/>
			</div>
			<button
				onClick={() => {
					if (location) {
						onAdd(location, type, qty);
						setLocation("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#ca8a04",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Add Bulb
			</button>
		</div>
	);
}
