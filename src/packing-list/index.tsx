import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PackingItem {
	id: string;
	name: string;
	checked: boolean;
}

interface PackingList {
	id: string;
	name: string;
	items: PackingItem[];
}

const defaultTemplates: PackingList[] = [
	{
		id: "weekend",
		name: "Weekend Trip",
		items: [
			{ id: "1", name: "Toothbrush", checked: false },
			{ id: "2", name: "Toothpaste", checked: false },
			{ id: "3", name: "Deodorant", checked: false },
			{ id: "4", name: "Shampoo", checked: false },
			{ id: "5", name: "Phone charger", checked: false },
			{ id: "6", name: "Underwear", checked: false },
			{ id: "7", name: "Socks", checked: false },
			{ id: "8", name: "Pajamas", checked: false },
			{ id: "9", name: "Medications", checked: false },
			{ id: "10", name: "Wallet", checked: false },
		],
	},
	{
		id: "beach",
		name: "Beach Vacation",
		items: [
			{ id: "1", name: "Swimsuit", checked: false },
			{ id: "2", name: "Sunscreen", checked: false },
			{ id: "3", name: "Sunglasses", checked: false },
			{ id: "4", name: "Beach towel", checked: false },
			{ id: "5", name: "Flip flops", checked: false },
			{ id: "6", name: "Hat", checked: false },
			{ id: "7", name: "Book", checked: false },
			{ id: "8", name: "Portable speaker", checked: false },
		],
	},
	{
		id: "business",
		name: "Business Trip",
		items: [
			{ id: "1", name: "Laptop", checked: false },
			{ id: "2", name: "Laptop charger", checked: false },
			{ id: "3", name: "Business cards", checked: false },
			{ id: "4", name: "Notebook", checked: false },
			{ id: "5", name: "Pens", checked: false },
			{ id: "6", name: "Dress shoes", checked: false },
			{ id: "7", name: "Belt", checked: false },
			{ id: "8", name: "Iron/steamer", checked: false },
		],
	},
];

export default function PackingList() {
	const [lists, setLists] = useState<PackingList[]>(() => {
		const saved = localStorage.getItem("packing-lists");
		return saved ? JSON.parse(saved) : defaultTemplates;
	});
	const [selectedList, setSelectedList] = useState<PackingList | null>(null);
	const [showCreate, setShowCreate] = useState(false);
	const [newListName, setNewListName] = useState("");

	useEffect(() => {
		localStorage.setItem("packing-lists", JSON.stringify(lists));
	}, [lists]);

	const createList = () => {
		if (!newListName.trim()) return;
		const newList: PackingList = {
			id: `list-${Date.now()}`,
			name: newListName,
			items: [],
		};
		setLists([...lists, newList]);
		setSelectedList(newList);
		setNewListName("");
		setShowCreate(false);
	};

	const duplicateList = (list: PackingList) => {
		const duplicated: PackingList = {
			id: `list-${Date.now()}`,
			name: `${list.name} (Copy)`,
			items: list.items.map((i) => ({
				...i,
				id: `item-${Math.random()}`,
				checked: false,
			})),
		};
		setLists([...lists, duplicated]);
	};

	const deleteList = (id: string) => {
		setLists(lists.filter((l) => l.id !== id));
		if (selectedList?.id === id) setSelectedList(null);
	};

	const toggleItem = (itemId: string) => {
		if (!selectedList) return;
		const updated = {
			...selectedList,
			items: selectedList.items.map((i) =>
				i.id === itemId ? { ...i, checked: !i.checked } : i,
			),
		};
		setSelectedList(updated);
		setLists(lists.map((l) => (l.id === updated.id ? updated : l)));
	};

	const addItem = (name: string) => {
		if (!selectedList || !name.trim()) return;
		const newItem: PackingItem = {
			id: `item-${Date.now()}`,
			name: name.trim(),
			checked: false,
		};
		const updated = {
			...selectedList,
			items: [...selectedList.items, newItem],
		};
		setSelectedList(updated);
		setLists(lists.map((l) => (l.id === updated.id ? updated : l)));
	};

	const removeItem = (itemId: string) => {
		if (!selectedList) return;
		const updated = {
			...selectedList,
			items: selectedList.items.filter((i) => i.id !== itemId),
		};
		setSelectedList(updated);
		setLists(lists.map((l) => (l.id === updated.id ? updated : l)));
	};

	const resetList = () => {
		if (!selectedList) return;
		const updated = {
			...selectedList,
			items: selectedList.items.map((i) => ({ ...i, checked: false })),
		};
		setSelectedList(updated);
		setLists(lists.map((l) => (l.id === updated.id ? updated : l)));
	};

	const checkedCount = selectedList?.items.filter((i) => i.checked).length ?? 0;
	const totalCount = selectedList?.items.length ?? 0;
	const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Packing List</h1>
				<p>Never forget anything</p>
			</div>

			{!selectedList ? (
				<>
					<button className="create-btn" onClick={() => setShowCreate(true)}>
						+ Create New List
					</button>
					<div className="lists-grid">
						{lists.map((list) => {
							const done = list.items.filter((i) => i.checked).length;
							const total = list.items.length;
							return (
								<div
									key={list.id}
									className="list-card"
									onClick={() => setSelectedList(list)}
								>
									<div className="list-header">
										<span className="list-name">{list.name}</span>
										<div className="list-actions">
											<button
												className="action-btn"
												onClick={(e) => {
													e.stopPropagation();
													duplicateList(list);
												}}
											>
												📋
											</button>
											<button
												className="action-btn delete"
												onClick={(e) => {
													e.stopPropagation();
													deleteList(list.id);
												}}
											>
												🗑️
											</button>
										</div>
									</div>
									<div className="list-progress">
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: total > 0 ? `${(done / total) * 100}%` : "0%",
												}}
											></div>
										</div>
										<span className="progress-text">
											{done}/{total} packed
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</>
			) : (
				<div className="list-detail">
					<button
						className="back-to-lists"
						onClick={() => setSelectedList(null)}
					>
						← All Lists
					</button>

					<div className="list-title-row">
						<h2>{selectedList.name}</h2>
						<button className="reset-btn" onClick={resetList}>
							Reset
						</button>
					</div>

					<div className="progress-section">
						<div className="progress-bar large">
							<div
								className="progress-fill"
								style={{ width: `${progress}%` }}
							></div>
						</div>
						<span className="progress-label">
							{checkedCount} of {totalCount} items packed (
							{Math.round(progress)}%)
						</span>
					</div>

					<div className="items-list">
						{selectedList.items.map((item) => (
							<div
								key={item.id}
								className={`packing-item ${item.checked ? "checked" : ""}`}
							>
								<label className="checkbox-label">
									<input
										type="checkbox"
										checked={item.checked}
										onChange={() => toggleItem(item.id)}
									/>
									<span className="checkmark"></span>
									<span className="item-name">{item.name}</span>
								</label>
								<button
									className="remove-item"
									onClick={() => removeItem(item.id)}
								>
									×
								</button>
							</div>
						))}
					</div>

					<form
						className="add-item-form"
						onSubmit={(e) => {
							e.preventDefault();
							const input = e.currentTarget.elements.namedItem(
								"itemName",
							) as HTMLInputElement;
							addItem(input.value);
							input.value = "";
						}}
					>
						<input name="itemName" type="text" placeholder="Add item..." />
						<button type="submit">Add</button>
					</form>
				</div>
			)}

			{showCreate && (
				<div className="modal-overlay" onClick={() => setShowCreate(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Create New List</h3>
						<input
							type="text"
							placeholder="List name"
							value={newListName}
							onChange={(e) => setNewListName(e.target.value)}
							autoFocus
						/>
						<p className="or-text">or start from template:</p>
						<div className="template-list">
							{defaultTemplates.map((t) => (
								<button
									key={t.id}
									className="template-btn"
									onClick={() => {
										setLists([...lists, { ...t, id: `list-${Date.now()}` }]);
										setShowCreate(false);
									}}
								>
									{t.name}
								</button>
							))}
						</div>
						<div className="modal-actions">
							<button
								className="cancel-btn"
								onClick={() => setShowCreate(false)}
							>
								Cancel
							</button>
							<button className="save-btn" onClick={createList}>
								Create
							</button>
						</div>
					</div>
				</div>
			)}

			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1e3a2f 0%, #0d1f17 100%); color: #e8ebe9; padding: 1.5rem; font-family: 'Nunito', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin-top: 1rem; margin-bottom: 1.5rem; }
        .header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.25rem; color: #55efc4; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .create-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #55efc4, #00b894); border: none; border-radius: 1rem; color: #0d1f17; font-weight: 700; font-size: 1rem; cursor: pointer; margin-bottom: 1.5rem; }
        .lists-grid { display: flex; flex-direction: column; gap: 0.75rem; }
        .list-card { background: rgba(255,255,255,0.04); border-radius: 1rem; padding: 1rem 1.25rem; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s; }
        .list-card:hover { background: rgba(255,255,255,0.08); transform: translateX(4px); }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .list-name { font-weight: 700; font-size: 1.1rem; }
        .list-actions { display: flex; gap: 0.25rem; }
        .action-btn { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.5; transition: opacity 0.2s; }
        .action-btn:hover { opacity: 1; }
        .list-progress { display: flex; align-items: center; gap: 0.75rem; }
        .progress-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #55efc4, #00b894); border-radius: 3px; transition: width 0.3s; }
        .progress-text { font-size: 0.8rem; color: rgba(255,255,255,0.5); white-space: nowrap; }
        .back-to-lists { background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 0.9rem; margin-bottom: 1rem; }
        .list-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .list-title-row h2 { margin: 0; font-size: 1.5rem; }
        .reset-btn { padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.1); border: none; border-radius: 0.5rem; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 0.85rem; }
        .progress-section { margin-bottom: 1.5rem; }
        .progress-bar.large { height: 10px; margin-bottom: 0.5rem; }
        .progress-label { font-size: 0.85rem; color: #55efc4; }
        .items-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .packing-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.05); }
        .packing-item.checked { opacity: 0.5; }
        .packing-item.checked .item-name { text-decoration: line-through; }
        .checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; flex: 1; }
        .checkbox-label input { display: none; }
        .checkmark { width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.3); border-radius: 0.35rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .checkbox-label input:checked + .checkmark { background: #55efc4; border-color: #55efc4; }
        .checkbox-label input:checked + .checkmark::after { content: '✓'; color: #0d1f17; font-weight: 700; font-size: 0.85rem; }
        .item-name { font-size: 1rem; }
        .remove-item { width: 24px; height: 24px; background: rgba(255,107,107,0.2); border: none; border-radius: 0.35rem; color: #ff6b6b; cursor: pointer; font-size: 1rem; }
        .add-item-form { display: flex; gap: 0.5rem; }
        .add-item-form input { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; color: white; }
        .add-item-form button { padding: 0.75rem 1.25rem; background: #55efc4; border: none; border-radius: 0.75rem; color: #0d1f17; font-weight: 600; cursor: pointer; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #1e3a2f; border-radius: 1.25rem; padding: 1.5rem; width: 100%; max-width: 350px; }
        .modal h3 { margin: 0 0 1rem; color: #55efc4; }
        .modal input { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 1rem; box-sizing: border-box; }
        .or-text { text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem; margin: 0 0 0.75rem; }
        .template-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .template-btn { padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; cursor: pointer; text-align: left; }
        .template-btn:hover { background: rgba(85,239,196,0.1); border-color: rgba(85,239,196,0.3); }
        .modal-actions { display: flex; gap: 0.5rem; }
        .cancel-btn { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.08); border: none; border-radius: 0.5rem; color: white; cursor: pointer; }
        .save-btn { flex: 1; padding: 0.75rem; background: #55efc4; border: none; border-radius: 0.5rem; color: #0d1f17; font-weight: 600; cursor: pointer; }
      `}</style>
		</div>
	);
}
