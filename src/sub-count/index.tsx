import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Sub {
	id: number;
	name: string;
	price: number;
	frequency: "monthly" | "yearly";
	category: string;
	renewalDate?: string;
}

export default function SubCount() {
	const [subs, setSubs] = useState<Sub[]>(() => {
		const saved = localStorage.getItem("subs");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("subs", JSON.stringify(subs));
	}, [subs]);

	const addSub = (
		name: string,
		price: number,
		frequency: Sub["frequency"],
		category: string,
	) => {
		setSubs([...subs, { id: Date.now(), name, price, frequency, category }]);
	};

	const deleteSub = (id: number) => {
		setSubs(subs.filter((s) => s.id !== id));
	};

	const categories = [
		"Entertainment",
		"Productivity",
		"Health",
		"News",
		"Other",
	];
	const monthlyTotal = subs.reduce(
		(a, s) => a + (s.frequency === "monthly" ? s.price : s.price / 12),
		0,
	);
	const yearlyTotal = subs.reduce(
		(a, s) => a + (s.frequency === "yearly" ? s.price : s.price * 12),
		0,
	);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1c1917",
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
					Sub Count
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Subscription tracker
				</p>

				<div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
					<div
						style={{
							flex: 1,
							background: "#292524",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
							Monthly
						</p>
						<p
							style={{
								margin: "0.25rem 0",
								fontSize: "1.5rem",
								fontWeight: "bold",
								color: "#f97316",
							}}
						>
							${monthlyTotal.toFixed(2)}
						</p>
					</div>
					<div
						style={{
							flex: 1,
							background: "#292524",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
							Yearly
						</p>
						<p
							style={{
								margin: "0.25rem 0",
								fontSize: "1.5rem",
								fontWeight: "bold",
								color: "#f97316",
							}}
						>
							${yearlyTotal.toFixed(2)}
						</p>
					</div>
				</div>

				<AddSubForm onAdd={addSub} categories={categories} />

				<h2
					style={{
						fontSize: "1.1rem",
						marginTop: "1.5rem",
						marginBottom: "1rem",
						opacity: 0.8,
					}}
				>
					Your Subscriptions
				</h2>
				{subs.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No subscriptions</p>
				)}

				{subs.map((s) => (
					<div
						key={s.id}
						style={{
							background: "#292524",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div>
							<p style={{ margin: 0, fontWeight: "bold" }}>{s.name}</p>
							<p
								style={{
									margin: "0.25rem 0",
									fontSize: "0.8rem",
									opacity: 0.6,
								}}
							>
								{s.category} · {s.frequency}
							</p>
						</div>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
								${s.price}
							</span>
							<button
								onClick={() => deleteSub(s.id)}
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
					</div>
				))}
			</div>
		</div>
	);
}

function AddSubForm({
	onAdd,
	categories,
}: {
	onAdd: (
		name: string,
		price: number,
		freq: Sub["frequency"],
		category: string,
	) => void;
	categories: string[];
}) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [freq, setFreq] = useState<"monthly" | "yearly">("monthly");
	const [category, setCategory] = useState(categories[0]);

	return (
		<div style={{ background: "#292524", borderRadius: 12, padding: "1rem" }}>
			<input
				type="text"
				placeholder="Service name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#1c1917",
					color: "white",
					marginBottom: "0.5rem",
				}}
			/>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
				<input
					type="number"
					placeholder="Price"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "none",
						background: "#1c1917",
						color: "white",
					}}
				/>
				<select
					value={freq}
					onChange={(e) => setFreq(e.target.value as "monthly" | "yearly")}
					style={{
						padding: "0.75rem",
						borderRadius: 8,
						border: "none",
						background: "#1c1917",
						color: "white",
					}}
				>
					<option value="monthly">Monthly</option>
					<option value="yearly">Yearly</option>
				</select>
			</div>
			<select
				value={category}
				onChange={(e) => setCategory(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#1c1917",
					color: "white",
					marginBottom: "0.75rem",
				}}
			>
				{categories.map((c) => (
					<option key={c} value={c}>
						{c}
					</option>
				))}
			</select>
			<button
				onClick={() => {
					if (name && price) {
						onAdd(name, Number(price), freq, category);
						setName("");
						setPrice("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#f97316",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Add Subscription
			</button>
		</div>
	);
}
