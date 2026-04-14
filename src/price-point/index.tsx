import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PriceEntry {
	date: string;
	price: number;
}

interface Item {
	id: number;
	name: string;
	prices: PriceEntry[];
}

export default function PricePoint() {
	const [items, setItems] = useState<Item[]>(() => {
		const saved = localStorage.getItem("price-items");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("price-items", JSON.stringify(items));
	}, [items]);

	const addItem = (name: string) => {
		setItems([...items, { id: Date.now(), name, prices: [] }]);
	};

	const addPrice = (itemId: number, price: number) => {
		const today = new Date().toISOString().split("T")[0];
		setItems(
			items.map((i) =>
				i.id === itemId
					? {
							...i,
							prices: [...i.prices, { date: today, price }].sort(
								(a, b) =>
									new Date(b.date).getTime() - new Date(a.date).getTime(),
							),
						}
					: i,
			),
		);
	};

	const deleteItem = (id: number) => {
		setItems(items.filter((i) => i.id !== id));
	};

	const getTrend = (prices: PriceEntry[]) => {
		if (prices.length < 2) return 0;
		const recent = prices[0].price;
		const old = prices[prices.length - 1].price;
		return (((recent - old) / old) * 100).toFixed(1);
	};

	const getCurrentPrice = (prices: PriceEntry[]) => {
		return prices[0]?.price;
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f0fdf4",
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
					Price Point
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Price history tracker
				</p>

				<AddItemForm onAdd={addItem} />

				{items.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, marginTop: "1.5rem" }}>
						No items tracked
					</p>
				)}

				{items.map((item) => {
					const currentPrice = getCurrentPrice(item.prices);
					const trend = getTrend(item.prices);
					const trendNum = Number(trend);
					return (
						<div
							key={item.id}
							style={{
								background: "white",
								borderRadius: 12,
								padding: "1rem",
								marginTop: "1rem",
								boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
								}}
							>
								<div>
									<p
										style={{
											margin: 0,
											fontWeight: "bold",
											fontSize: "1.1rem",
										}}
									>
										{item.name}
									</p>
									{item.prices.length > 0 && (
										<p
											style={{
												margin: "0.25rem 0",
												fontSize: "0.8rem",
												opacity: 0.6,
											}}
										>
											{item.prices.length} prices tracked
										</p>
									)}
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

							{item.prices.length > 0 && (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "1rem",
										marginTop: "0.75rem",
									}}
								>
									<span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
										${currentPrice}
									</span>
									<span
										style={{
											fontSize: "0.9rem",
											color:
												trendNum < 0
													? "#22c55e"
													: trendNum > 0
														? "#ef4444"
														: "#6b7280",
										}}
									>
										{trendNum < 0 ? "↓" : trendNum > 0 ? "↑" : "→"}{" "}
										{Math.abs(Number(trend))}%
									</span>
								</div>
							)}

							<AddPriceForm onAdd={(price) => addPrice(item.id, price)} />

							{item.prices.length > 0 && (
								<div style={{ marginTop: "0.75rem" }}>
									<p
										style={{
											margin: 0,
											fontSize: "0.75rem",
											opacity: 0.5,
											marginBottom: "0.25rem",
										}}
									>
										History
									</p>
									{item.prices.slice(0, 5).map((p, i) => (
										<div
											key={i}
											style={{
												display: "flex",
												justifyContent: "space-between",
												padding: "0.25rem 0",
												fontSize: "0.85rem",
												borderBottom: i < 4 ? "1px solid #f3f4f6" : "none",
											}}
										>
											<span style={{ opacity: 0.6 }}>{p.date}</span>
											<span>${p.price}</span>
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function AddItemForm({ onAdd }: { onAdd: (name: string) => void }) {
	const [name, setName] = useState("");
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
				placeholder="Item name (e.g., Eggs, Gas)"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #dcfce7",
					marginBottom: "0.75rem",
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
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#22c55e",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Track Item
			</button>
		</div>
	);
}

function AddPriceForm({ onAdd }: { onAdd: (price: number) => void }) {
	const [price, setPrice] = useState("");
	return (
		<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
			<input
				type="number"
				placeholder="New price"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
				style={{
					flex: 1,
					padding: "0.5rem",
					borderRadius: 6,
					border: "1px solid #dcfce7",
					fontSize: "0.9rem",
				}}
			/>
			<button
				onClick={() => {
					if (price) {
						onAdd(Number(price));
						setPrice("");
					}
				}}
				style={{
					padding: "0.5rem 1rem",
					borderRadius: 6,
					border: "none",
					background: "#22c55e",
					color: "white",
					cursor: "pointer",
					fontSize: "0.9rem",
				}}
			>
				Log
			</button>
		</div>
	);
}
