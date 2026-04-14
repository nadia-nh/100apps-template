import { useState } from "react";
import { Link } from "react-router-dom";

interface Gift {
	id: string;
	person: string;
	idea: string;
	budget: string;
	purchased: boolean;
}

export default function GiftIdea() {
	const [gifts, setGifts] = useState<Gift[]>([]);
	const [newGift, setNewGift] = useState({ person: "", idea: "", budget: "" });
	const [filter, setFilter] = useState<"all" | "purchased" | "not">("all");

	const add = () => {
		if (newGift.person && newGift.idea) {
			setGifts([
				...gifts,
				{
					id: `g-${Date.now()}`,
					person: newGift.person,
					idea: newGift.idea,
					budget: newGift.budget,
					purchased: false,
				},
			]);
			setNewGift({ person: "", idea: "", budget: "" });
		}
	};
	const toggle = (id: string) =>
		setGifts(
			gifts.map((g) => (g.id === id ? { ...g, purchased: !g.purchased } : g)),
		);
	const remove = (id: string) => setGifts(gifts.filter((g) => g.id !== id));

	const filtered =
		filter === "all"
			? gifts
			: filter === "purchased"
				? gifts.filter((g) => g.purchased)
				: gifts.filter((g) => !g.purchased);
	const byPerson = filtered.reduce(
		(acc, g) => {
			if (!acc[g.person]) acc[g.person] = [];
			acc[g.person].push(g);
			return acc;
		},
		{} as Record<string, Gift[]>,
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Gift Idea</h1>
				<p>Track gift ideas</p>
			</div>
			<div className="filters">
				<button
					className={filter === "all" ? "active" : ""}
					onClick={() => setFilter("all")}
				>
					All
				</button>
				<button
					className={filter === "not" ? "active" : ""}
					onClick={() => setFilter("not")}
				>
					To Buy
				</button>
				<button
					className={filter === "purchased" ? "active" : ""}
					onClick={() => setFilter("purchased")}
				>
					Purchased
				</button>
			</div>
			<div className="add-form">
				<input
					value={newGift.person}
					onChange={(e) => setNewGift({ ...newGift, person: e.target.value })}
					placeholder="Person"
				/>
				<input
					value={newGift.idea}
					onChange={(e) => setNewGift({ ...newGift, idea: e.target.value })}
					placeholder="Gift idea"
				/>
				<input
					value={newGift.budget}
					onChange={(e) => setNewGift({ ...newGift, budget: e.target.value })}
					placeholder="Budget"
				/>
				<button onClick={add}>Add</button>
			</div>
			<div className="gifts-list">
				{Object.entries(byPerson).map(([person, personGifts]) => (
					<div key={person} className="person-group">
						<h3>{person}</h3>
						{personGifts.map((gift) => (
							<div
								key={gift.id}
								className={`gift-item ${gift.purchased ? "purchased" : ""}`}
							>
								<button className="check" onClick={() => toggle(gift.id)}>
									{gift.purchased ? "✓" : "○"}
								</button>
								<div className="gift-info">
									<span className="gift-idea">{gift.idea}</span>
									{gift.budget && (
										<span className="gift-budget">${gift.budget}</span>
									)}
								</div>
								<button className="remove" onClick={() => remove(gift.id)}>
									×
								</button>
							</div>
						))}
					</div>
				))}
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .filters button { flex: 1; padding: 0.5rem; background: rgba(255,255,255,0.15); border: none; border-radius: 0.5rem; color: white; cursor: pointer; }
        .filters button.active { background: white; color: #f5576c; }
        .add-form { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem; }
        .add-form input { padding: 0.6rem; background: rgba(255,255,255,0.15); border: none; border-radius: 0.4rem; color: white; }
        .add-form input:first-child { grid-column: span 2; }
        .add-form button { grid-column: span 2; padding: 0.75rem; background: white; border: none; border-radius: 0.5rem; color: #f5576c; font-weight: 600; cursor: pointer; }
        .gifts-list { }
        .person-group { margin-bottom: 1rem; }
        .person-group h3 { margin: 0 0 0.5rem; font-size: 1rem; color: white; }
        .gift-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem; margin-bottom: 0.3rem; }
        .gift-item.purchased { opacity: 0.6; }
        .gift-item .check { width: 24px; height: 24px; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
        .gift-info { flex: 1; display: flex; justify-content: space-between; }
        .gift-idea { font-size: 0.9rem; }
        .gift-budget { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
        .gift-item .remove { width: 24px; height: 24px; background: rgba(255,255,255,0.1); border: none; border-radius: 0.3rem; color: white; cursor: pointer; }
      `}</style>
		</div>
	);
}
