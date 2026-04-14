import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Receipt {
	id: number;
	store: string;
	date: string;
	category: string;
	amount: number;
	image?: string;
}

export default function ReceiptHold() {
	const [receipts, setReceipts] = useState<Receipt[]>(() => {
		const saved = localStorage.getItem("receipts");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [newReceipt, setNewReceipt] = useState<{
		store: string;
		date: string;
		category: string;
		amount: string;
		image?: string;
	}>({
		store: "",
		date: new Date().toISOString().split("T")[0],
		category: "Food",
		amount: "",
	});
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		localStorage.setItem("receipts", JSON.stringify(receipts));
	}, [receipts]);

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setNewReceipt({ ...newReceipt, image: reader.result as string });
		};
		reader.readAsDataURL(file);
	};

	const saveReceipt = () => {
		if (!newReceipt.store || !newReceipt.amount) return;
		setReceipts([
			{
				id: Date.now(),
				...newReceipt,
				amount: Number(newReceipt.amount),
				image: newReceipt.image,
			},
			...receipts,
		]);
		setNewReceipt({
			store: "",
			date: new Date().toISOString().split("T")[0],
			category: "Food",
			amount: "",
		});
		setShowAdd(false);
	};

	const deleteReceipt = (id: number) => {
		setReceipts(receipts.filter((r) => r.id !== id));
	};

	const categories = [
		"Food",
		"Groceries",
		"Transport",
		"Entertainment",
		"Utilities",
		"Other",
	];
	const totalThisMonth = receipts
		.filter((r) => r.date.startsWith(new Date().toISOString().slice(0, 7)))
		.reduce((a, r) => a + r.amount, 0);

	const byCategory = categories.map((cat) => ({
		category: cat,
		total: receipts
			.filter(
				(r) =>
					r.category === cat &&
					r.date.startsWith(new Date().toISOString().slice(0, 7)),
			)
			.reduce((a, r) => a + r.amount, 0),
	}));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f5f5f4",
				color: "#1c1917",
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
					color: "rgba(28,25,23,0.5)",
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
					Receipt Hold
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Store receipt photos
				</p>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "none",
						background: "#78716c",
						color: "white",
						fontWeight: "bold",
						cursor: "pointer",
						marginBottom: "1.5rem",
					}}
				>
					+ Add Receipt
				</button>

				{showAdd && (
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
							placeholder="Store name"
							value={newReceipt.store}
							onChange={(e) =>
								setNewReceipt({ ...newReceipt, store: e.target.value })
							}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #e7e5e4",
								marginBottom: "0.5rem",
							}}
						/>
						<input
							type="date"
							value={newReceipt.date}
							onChange={(e) =>
								setNewReceipt({ ...newReceipt, date: e.target.value })
							}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #e7e5e4",
								marginBottom: "0.5rem",
							}}
						/>
						<select
							value={newReceipt.category}
							onChange={(e) =>
								setNewReceipt({ ...newReceipt, category: e.target.value })
							}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #e7e5e4",
								marginBottom: "0.5rem",
							}}
						>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<input
							type="number"
							placeholder="Amount"
							value={newReceipt.amount}
							onChange={(e) =>
								setNewReceipt({ ...newReceipt, amount: e.target.value })
							}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #e7e5e4",
								marginBottom: "0.5rem",
							}}
						/>
						<input
							type="file"
							accept="image/*"
							ref={fileRef}
							onChange={handleImage}
							style={{ marginBottom: "0.75rem" }}
						/>
						{newReceipt.image && (
							<img
								src={newReceipt.image}
								alt="Receipt"
								style={{
									width: "100%",
									borderRadius: 8,
									marginBottom: "0.75rem",
								}}
							/>
						)}
						<button
							onClick={saveReceipt}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#78716c",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Save Receipt
						</button>
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
					<p style={{ margin: 0, opacity: 0.6, fontSize: "0.9rem" }}>
						This Month
					</p>
					<p
						style={{
							margin: "0.25rem 0 0",
							fontSize: "2rem",
							fontWeight: "bold",
						}}
					>
						${totalThisMonth.toFixed(2)}
					</p>
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					By Category
				</h2>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "0.5rem",
						marginBottom: "1.5rem",
					}}
				>
					{byCategory.map(
						(cat) =>
							cat.total > 0 && (
								<div
									key={cat.category}
									style={{
										background: "white",
										borderRadius: 8,
										padding: "0.5rem 0.75rem",
										fontSize: "0.85rem",
									}}
								>
									<span style={{ opacity: 0.6 }}>{cat.category}: </span>
									<span style={{ fontWeight: "bold" }}>
										${cat.total.toFixed(2)}
									</span>
								</div>
							),
					)}
				</div>

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Receipts
				</h2>
				{receipts.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No receipts</p>
				)}

				{receipts.map((r) => (
					<div
						key={r.id}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<p style={{ margin: 0, fontWeight: "bold" }}>{r.store}</p>
								<p
									style={{
										margin: "0.25rem 0 0",
										fontSize: "0.85rem",
										opacity: 0.6,
									}}
								>
									{r.date} · {r.category}
								</p>
							</div>
							<div style={{ textAlign: "right" }}>
								<p
									style={{ margin: 0, fontWeight: "bold", fontSize: "1.2rem" }}
								>
									${r.amount.toFixed(2)}
								</p>
								<button
									onClick={() => deleteReceipt(r.id)}
									style={{
										background: "none",
										border: "none",
										color: "#ef4444",
										cursor: "pointer",
										fontSize: "0.8rem",
									}}
								>
									Delete
								</button>
							</div>
						</div>
						{r.image && (
							<img
								src={r.image}
								alt="Receipt"
								style={{
									width: "100%",
									borderRadius: 8,
									marginTop: "0.75rem",
									maxHeight: 200,
									objectFit: "cover",
								}}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
