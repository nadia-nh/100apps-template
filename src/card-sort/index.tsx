import { useState } from "react";
import { Link } from "react-router-dom";

export default function CardSort() {
	const [items, setItems] = useState<string[]>([]);
	const [newItem, setNewItem] = useState("");
	const [dragged, setDragged] = useState<number | null>(null);

	const add = () => {
		if (newItem.trim()) {
			setItems([...items, newItem.trim()]);
			setNewItem("");
		}
	};

	const dragStart = (i: number) => {
		setDragged(i);
	};
	const dragOver = (e: React.DragEvent, i: number) => {
		e.preventDefault();
	};
	const drop = (i: number) => {
		if (dragged === null) return;
		const newItems = [...items];
		const [removed] = newItems.splice(dragged, 1);
		newItems.splice(i, 0, removed);
		setItems(newItems);
		setDragged(null);
	};

	const moveUp = (i: number) => {
		if (i > 0) {
			const newItems = [...items];
			[newItems[i - 1], newItems[i]] = [newItems[i], newItems[i - 1]];
			setItems(newItems);
		}
	};
	const moveDown = (i: number) => {
		if (i < items.length - 1) {
			const newItems = [...items];
			[newItems[i], newItems[i + 1]] = [newItems[i + 1], newItems[i]];
			setItems(newItems);
		}
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Card Sort</h1>
				<p>Drag to rank items</p>
			</div>
			<div className="input-row">
				<input
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && add()}
					placeholder="Add item to rank..."
				/>
				<button onClick={add}>+</button>
			</div>
			<div className="cards-list">
				{items.map((item, i) => (
					<div
						key={i}
						className={`rank-card ${dragged === i ? "dragging" : ""}`}
						draggable
						onDragStart={() => dragStart(i)}
						onDragOver={(e) => dragOver(e, i)}
						onDrop={() => drop(i)}
					>
						<span className="rank-number">#{i + 1}</span>
						<span className="item-name">{item}</span>
						<div className="card-actions">
							<button onClick={() => moveUp(i)} disabled={i === 0}>
								↑
							</button>
							<button
								onClick={() => moveDown(i)}
								disabled={i === items.length - 1}
							>
								↓
							</button>
							<button
								className="remove"
								onClick={() => setItems(items.filter((_, idx) => idx !== i))}
							>
								×
							</button>
						</div>
					</div>
				))}
			</div>
			{items.length > 0 && (
				<button className="clear-btn" onClick={() => setItems([])}>
					Clear All
				</button>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #00d2ff, #3a7bd5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .input-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        .input-row input { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; }
        .input-row button { padding: 0.75rem 1.25rem; background: #00d2ff; border: none; border-radius: 0.5rem; color: #1a1a2e; font-weight: 600; cursor: pointer; }
        .cards-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .rank-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; background: rgba(255,255,255,0.05); border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.08); cursor: grab; transition: all 0.2s; }
        .rank-card:hover { background: rgba(255,255,255,0.1); transform: translateX(4px); }
        .rank-card.dragging { opacity: 0.5; background: rgba(0,210,255,0.1); border-color: #00d2ff; }
        .rank-number { font-weight: 700; color: #00d2ff; min-width: 30px; }
        .item-name { flex: 1; font-size: 1rem; }
        .card-actions { display: flex; gap: 0.25rem; }
        .card-actions button { width: 28px; height: 28px; background: rgba(255,255,255,0.1); border: none; border-radius: 0.4rem; color: white; cursor: pointer; font-size: 0.9rem; }
        .card-actions button:disabled { opacity: 0.3; cursor: not-allowed; }
        .card-actions button.remove { background: rgba(255,107,107,0.2); color: #ff6b6b; }
        .clear-btn { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; cursor: pointer; }
      `}</style>
		</div>
	);
}
