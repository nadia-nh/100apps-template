import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Entry {
	date: string;
	items: string[];
}

export default function GratitudeLog() {
	const [entries, setEntries] = useState<Entry[]>(() => {
		const saved = localStorage.getItem("gratitude-log");
		return saved ? JSON.parse(saved) : [];
	});
	const [items, setItems] = useState(["", "", ""]);
	const today = new Date().toISOString().split("T")[0];
	const todayEntry = entries.find((e) => e.date === today);

	useEffect(() => {
		localStorage.setItem("gratitude-log", JSON.stringify(entries));
	}, [entries]);

	const updateItem = (i: number, val: string) => {
		const newItems = [...items];
		newItems[i] = val;
		setItems(newItems);
	};

	const saveEntry = () => {
		const filled = items.filter((i) => i.trim());
		if (filled.length === 0) return;
		const newEntry: Entry = { date: today, items: filled };
		const filtered = entries.filter((e) => e.date !== today);
		setEntries([newEntry, ...filtered]);
		setItems(["", "", ""]);
	};

	const deleteEntry = (date: string) => {
		setEntries(entries.filter((e) => e.date !== date));
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #fdf4f4 0%, #fce4ec 100%)",
				color: "#374151",
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
					color: "rgba(55,65,81,0.5)",
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
						color: "#be185d",
					}}
				>
					Gratitude Log
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					What are you grateful for today?
				</p>

				{todayEntry ? (
					<div
						style={{
							background: "white",
							borderRadius: 16,
							padding: "1.5rem",
							marginBottom: "1.5rem",
							boxShadow: "0 4px 20px rgba(190,24,93,0.1)",
						}}
					>
						<p
							style={{
								margin: "0 0 1rem",
								fontSize: "0.85rem",
								color: "#22c55e",
								fontWeight: "bold",
							}}
						>
							Today's gratitude
						</p>
						{todayEntry.items.map((item, i) => (
							<p
								key={i}
								style={{
									margin: "0 0 0.5rem",
									fontSize: "1.1rem",
									display: "flex",
									alignItems: "flex-start",
									gap: "0.5rem",
								}}
							>
								<span style={{ color: "#f472b6" }}>♥</span>
								{item}
							</p>
						))}
					</div>
				) : (
					<div
						style={{
							background: "white",
							borderRadius: 16,
							padding: "1.5rem",
							marginBottom: "1.5rem",
							boxShadow: "0 4px 20px rgba(190,24,93,0.1)",
						}}
					>
						<p style={{ margin: "0 0 1rem", fontSize: "0.9rem", opacity: 0.6 }}>
							I am grateful for...
						</p>
						{items.map((item, i) => (
							<input
								key={i}
								type="text"
								placeholder={`${i + 1}.`}
								value={item}
								onChange={(e) => updateItem(i, e.target.value)}
								style={{
									width: "100%",
									padding: "0.75rem",
									borderRadius: 8,
									border: "1px solid #fce7f3",
									background: "#fdf4f4",
									color: "#374151",
									marginBottom: "0.75rem",
									fontSize: "1rem",
								}}
							/>
						))}
						<button
							onClick={saveEntry}
							style={{
								width: "100%",
								padding: "1rem",
								borderRadius: 8,
								border: "none",
								background: "linear-gradient(135deg, #f472b6, #ec4899)",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
								fontSize: "1rem",
							}}
						>
							Save Gratitude
						</button>
					</div>
				)}

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.7 }}>
					Past Entries
				</h2>

				{entries.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No entries yet</p>
				)}

				{entries
					.filter((e) => e.date !== today)
					.slice(0, 10)
					.map((entry) => (
						<div
							key={entry.date}
							style={{
								background: "white",
								borderRadius: 12,
								padding: "1rem",
								marginBottom: "0.75rem",
								boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "0.5rem",
								}}
							>
								<span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
									{new Date(entry.date).toLocaleDateString("en", {
										weekday: "short",
										month: "short",
										day: "numeric",
									})}
								</span>
								<button
									onClick={() => deleteEntry(entry.date)}
									style={{
										background: "transparent",
										border: "none",
										color: "#ef4444",
										cursor: "pointer",
										fontSize: "1rem",
									}}
								>
									×
								</button>
							</div>
							{entry.items.map((item, i) => (
								<p
									key={i}
									style={{
										margin: "0 0 0.25rem",
										fontSize: "0.95rem",
										display: "flex",
										alignItems: "flex-start",
										gap: "0.5rem",
									}}
								>
									<span style={{ color: "#f472b6", fontSize: "0.8rem" }}>
										♥
									</span>
									{item}
								</p>
							))}
						</div>
					))}
			</div>
		</div>
	);
}
