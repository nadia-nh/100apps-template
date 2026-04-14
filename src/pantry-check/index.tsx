import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PantryItem {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	expiryDate: string | null;
	category: string;
	addedDate: string;
}

const categories = [
	"Produce",
	"Dairy",
	"Meat",
	"Grains",
	"Canned",
	"Frozen",
	"Snacks",
	"Beverages",
	"Condiments",
	"Other",
];

export default function PantryCheck() {
	const [items, setItems] = useState<PantryItem[]>(() => {
		const saved = localStorage.getItem("pantry-items");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [filter, setFilter] = useState<"all" | "expiring" | "low">("all");
	const [sortBy, setSortBy] = useState<"name" | "expiry" | "category">(
		"expiry",
	);

	const [newItem, setNewItem] = useState({
		name: "",
		quantity: 1,
		unit: "",
		expiryDate: "",
		category: "Other",
	});

	useEffect(() => {
		localStorage.setItem("pantry-items", JSON.stringify(items));
	}, [items]);

	const addItem = () => {
		if (!newItem.name.trim()) return;
		const item: PantryItem = {
			id: `item-${Date.now()}`,
			name: newItem.name.trim(),
			quantity: newItem.quantity,
			unit: newItem.unit,
			expiryDate: newItem.expiryDate || null,
			category: newItem.category,
			addedDate: new Date().toISOString(),
		};
		setItems([...items, item]);
		setNewItem({
			name: "",
			quantity: 1,
			unit: "",
			expiryDate: "",
			category: "Other",
		});
		setShowAdd(false);
	};

	const updateQuantity = (id: string, delta: number) => {
		setItems(
			items
				.map((i) =>
					i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i,
				)
				.filter((i) => i.quantity > 0),
		);
	};

	const removeItem = (id: string) => {
		setItems(items.filter((i) => i.id !== id));
	};

	const isExpiringSoon = (date: string | null) => {
		if (!date) return false;
		const daysUntil = Math.ceil(
			(new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);
		return daysUntil <= 3;
	};

	const isLowStock = (item: PantryItem) => {
		return item.quantity <= 1;
	};

	const getDaysUntilExpiry = (date: string | null) => {
		if (!date) return null;
		return Math.ceil(
			(new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);
	};

	const sortedItems = [...items].sort((a, b) => {
		if (sortBy === "expiry") {
			if (!a.expiryDate && !b.expiryDate) return 0;
			if (!a.expiryDate) return 1;
			if (!b.expiryDate) return -1;
			return (
				new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
			);
		}
		if (sortBy === "category") return a.category.localeCompare(b.category);
		return a.name.localeCompare(b.name);
	});

	const filteredItems = sortedItems.filter((item) => {
		if (filter === "expiring") return isExpiringSoon(item.expiryDate);
		if (filter === "low") return isLowStock(item);
		return true;
	});

	const expiringCount = items.filter((i) =>
		isExpiringSoon(i.expiryDate),
	).length;
	const lowStockCount = items.filter((i) => isLowStock(i)).length;

	const groupedByCategory = filteredItems.reduce(
		(acc, item) => {
			if (!acc[item.category]) acc[item.category] = [];
			acc[item.category].push(item);
			return acc;
		},
		{} as Record<string, PantryItem[]>,
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Pantry Check</h1>
				<p>Track your inventory</p>
			</div>

			<div className="stats-row">
				<div className="stat-card expiring">
					<span className="stat-value">{expiringCount}</span>
					<span className="stat-label">Expiring Soon</span>
				</div>
				<div className="stat-card low">
					<span className="stat-value">{lowStockCount}</span>
					<span className="stat-label">Low Stock</span>
				</div>
				<div className="stat-card total">
					<span className="stat-value">{items.length}</span>
					<span className="stat-label">Total Items</span>
				</div>
			</div>

			<div className="filters">
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value as any)}
				>
					<option value="all">All Items</option>
					<option value="expiring">Expiring Soon</option>
					<option value="low">Low Stock</option>
				</select>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as any)}
				>
					<option value="expiry">Sort by Expiry</option>
					<option value="name">Sort by Name</option>
					<option value="category">Sort by Category</option>
				</select>
			</div>

			<button className="add-btn" onClick={() => setShowAdd(true)}>
				+ Add Item
			</button>

			{showAdd && (
				<div className="modal-overlay" onClick={() => setShowAdd(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Add Item</h3>
						<input
							type="text"
							placeholder="Item name"
							value={newItem.name}
							onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
							autoFocus
						/>
						<div className="form-row">
							<input
								type="number"
								min="1"
								placeholder="Qty"
								value={newItem.quantity}
								onChange={(e) =>
									setNewItem({
										...newItem,
										quantity: parseInt(e.target.value) || 1,
									})
								}
							/>
							<input
								type="text"
								placeholder="Unit (optional)"
								value={newItem.unit}
								onChange={(e) =>
									setNewItem({ ...newItem, unit: e.target.value })
								}
							/>
						</div>
						<input
							type="date"
							value={newItem.expiryDate}
							onChange={(e) =>
								setNewItem({ ...newItem, expiryDate: e.target.value })
							}
						/>
						<select
							value={newItem.category}
							onChange={(e) =>
								setNewItem({ ...newItem, category: e.target.value })
							}
						>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<div className="modal-actions">
							<button className="cancel-btn" onClick={() => setShowAdd(false)}>
								Cancel
							</button>
							<button className="save-btn" onClick={addItem}>
								Add
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="items-list">
				{items.length === 0 ? (
					<div className="empty-state">
						<span className="empty-icon">🫙</span>
						<p>Your pantry is empty</p>
					</div>
				) : Object.keys(groupedByCategory).length === 0 ? (
					<div className="empty-state">
						<p>No items match your filter</p>
					</div>
				) : (
					Object.entries(groupedByCategory).map(([category, categoryItems]) => (
						<div key={category} className="category-group">
							<h3 className="category-title">{category}</h3>
							{categoryItems.map((item) => {
								const days = getDaysUntilExpiry(item.expiryDate);
								return (
									<div
										key={item.id}
										className={`item-card ${isExpiringSoon(item.expiryDate) ? "expiring" : ""} ${isLowStock(item) ? "low" : ""}`}
									>
										<div className="item-info">
											<span className="item-name">{item.name}</span>
											<span className="item-expiry">
												{days !== null &&
													(days < 0
														? "Expired"
														: days === 0
															? "Expires today"
															: `Expires in ${days} day${days !== 1 ? "s" : ""}`)}
											</span>
										</div>
										<div className="item-controls">
											<button onClick={() => updateQuantity(item.id, -1)}>
												−
											</button>
											<span className="item-qty">
												{item.quantity} {item.unit}
											</span>
											<button onClick={() => updateQuantity(item.id, 1)}>
												+
											</button>
											<button
												className="delete-btn"
												onClick={() => removeItem(item.id)}
											>
												×
											</button>
										</div>
									</div>
								);
							})}
						</div>
					))
				)}
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #1e272e 0%, #141a1d 100%);
          color: #e8ebe9;
          padding: 1.5rem;
          font-family: 'Work Sans', system-ui, sans-serif;
        }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .back-button:hover { color: white; }
        .header { text-align: center; margin-top: 1rem; margin-bottom: 1.5rem; }
        .header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.25rem; color: #f8b500; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .stats-row { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 1.5rem; }
        .stat-card { padding: 1rem; background: rgba(255,255,255,0.04); border-radius: 1rem; text-align: center; min-width: 80px; border: 1px solid rgba(255,255,255,0.05); }
        .stat-card.expiring { border-color: rgba(255, 107, 107, 0.3); }
        .stat-card.low { border-color: rgba(255, 193, 7, 0.3); }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 700; }
        .stat-card.expiring .stat-value { color: #ff6b6b; }
        .stat-card.low .stat-value { color: #ffc107; }
        .stat-card.total .stat-value { color: #f8b500; }
        .stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
        .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .filters select { flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; }
        .add-btn { width: 100%; padding: 0.85rem; background: linear-gradient(135deg, #f8b500, #f39c12); border: none; border-radius: 0.75rem; color: #1e272e; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #1e272e; border-radius: 1.25rem; padding: 1.5rem; width: 100%; max-width: 350px; border: 1px solid rgba(255,255,255,0.1); }
        .modal h3 { margin: 0 0 1rem; color: #f8b500; }
        .modal input, .modal select { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 0.75rem; box-sizing: border-box; }
        .modal .form-row { display: flex; gap: 0.5rem; }
        .modal-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .cancel-btn { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; cursor: pointer; }
        .save-btn { flex: 1; padding: 0.75rem; background: #f8b500; border: none; border-radius: 0.5rem; color: #1e272e; font-weight: 600; cursor: pointer; }
        .items-list { display: flex; flex-direction: column; gap: 1rem; }
        .category-group { }
        .category-title { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin: 0 0 0.5rem; }
        .item-card { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.05); }
        .item-card.expiring { border-color: rgba(255,107,107,0.3); background: rgba(255,107,107,0.05); }
        .item-card.low { border-color: rgba(255,193,7,0.3); }
        .item-info { display: flex; flex-direction: column; gap: 0.15rem; }
        .item-name { font-weight: 500; }
        .item-expiry { font-size: 0.75rem; color: #ff6b6b; }
        .item-controls { display: flex; align-items: center; gap: 0.4rem; }
        .item-controls button { width: 28px; height: 28px; background: rgba(255,255,255,0.1); border: none; border-radius: 0.4rem; color: white; cursor: pointer; font-size: 1rem; }
        .item-controls .delete-btn { background: rgba(255,107,107,0.2); color: #ff6b6b; }
        .item-qty { min-width: 50px; text-align: center; font-size: 0.9rem; }
        .empty-state { text-align: center; padding: 3rem 1rem; color: rgba(255,255,255,0.3); }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
      `}</style>
		</div>
	);
}
