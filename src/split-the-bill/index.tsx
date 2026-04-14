import { useState } from "react";
import { Link } from "react-router-dom";

interface Person {
	id: string;
	name: string;
	customItems: { name: string; price: number }[];
}

const tipOptions = [15, 18, 20, 25];

export default function SplitTheBill() {
	const [billTotal, setBillTotal] = useState("");
	const [people, setPeople] = useState<Person[]>([
		{ id: "1", name: "You", customItems: [] },
	]);
	const [newPersonName, setNewPersonName] = useState("");
	const [tipPercent, setTipPercent] = useState(18);
	const [customTip, setCustomTip] = useState("");
	const [splitType, setSplitType] = useState<"even" | "custom">("even");

	const subtotal = parseFloat(billTotal) || 0;
	const effectiveTip = customTip ? parseFloat(customTip) : tipPercent;
	const tipAmount = (subtotal * effectiveTip) / 100;
	const total = subtotal + tipAmount;

	const totalCustomItems = people.reduce(
		(sum, p) => sum + p.customItems.reduce((s, i) => s + i.price, 0),
		0,
	);

	const evenSplit =
		people.length > 0 ? (total - totalCustomItems) / people.length : 0;

	const addPerson = () => {
		if (newPersonName.trim()) {
			setPeople([
				...people,
				{
					id: Date.now().toString(),
					name: newPersonName.trim(),
					customItems: [],
				},
			]);
			setNewPersonName("");
		}
	};

	const removePerson = (id: string) => {
		if (people.length > 1) {
			setPeople(people.filter((p) => p.id !== id));
		}
	};

	const updatePersonName = (id: string, name: string) => {
		setPeople(people.map((p) => (p.id === id ? { ...p, name } : p)));
	};

	const addCustomItem = (personId: string) => {
		setPeople(
			people.map((p) => {
				if (p.id === personId) {
					return {
						...p,
						customItems: [...p.customItems, { name: "Item", price: 0 }],
					};
				}
				return p;
			}),
		);
	};

	const updateCustomItem = (
		personId: string,
		index: number,
		field: "name" | "price",
		value: string | number,
	) => {
		setPeople(
			people.map((p) => {
				if (p.id === personId) {
					const items = [...p.customItems];
					items[index] = {
						...items[index],
						[field]:
							field === "price" ? parseFloat(value as string) || 0 : value,
					};
					return { ...p, customItems: items };
				}
				return p;
			}),
		);
	};

	const removeCustomItem = (personId: string, index: number) => {
		setPeople(
			people.map((p) => {
				if (p.id === personId) {
					return {
						...p,
						customItems: p.customItems.filter((_, i) => i !== index),
					};
				}
				return p;
			}),
		);
	};

	const calculatePersonTotal = (person: Person) => {
		const customTotal = person.customItems.reduce(
			(sum, item) => sum + item.price,
			0,
		);
		if (splitType === "custom") {
			const customShare = (customTotal / (totalCustomItems || 1)) * tipAmount;
			return customTotal + customShare;
		}
		return customTotal + evenSplit;
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Split the Bill</h1>
				<p>No more math headaches</p>
			</div>

			<div className="receipt">
				<div className="receipt-header">
					<span className="receipt-title">🧾 Bill</span>
				</div>

				<div className="bill-input-section">
					<label>Bill Total</label>
					<div className="input-with-prefix">
						<span className="prefix">$</span>
						<input
							type="number"
							placeholder="0.00"
							value={billTotal}
							onChange={(e) => setBillTotal(e.target.value)}
						/>
					</div>
				</div>

				<div className="tip-section">
					<label>Tip</label>
					<div className="tip-options">
						{tipOptions.map((tip) => (
							<button
								key={tip}
								className={`tip-btn ${tipPercent === tip && !customTip ? "active" : ""}`}
								onClick={() => {
									setTipPercent(tip);
									setCustomTip("");
								}}
							>
								{tip}%
							</button>
						))}
						<input
							type="number"
							placeholder="Custom"
							className="custom-tip"
							value={customTip}
							onChange={(e) => setCustomTip(e.target.value)}
						/>
					</div>
				</div>

				<div className="split-toggle">
					<button
						className={splitType === "even" ? "active" : ""}
						onClick={() => setSplitType("even")}
					>
						Split Evenly
					</button>
					<button
						className={splitType === "custom" ? "active" : ""}
						onClick={() => setSplitType("custom")}
					>
						By Item
					</button>
				</div>

				<div className="divider"></div>

				<div className="people-section">
					<label>People</label>
					{people.map((person) => (
						<div key={person.id} className="person-card">
							<div className="person-header">
								<input
									type="text"
									value={person.name}
									onChange={(e) => updatePersonName(person.id, e.target.value)}
									className="person-name"
								/>
								{people.length > 1 && (
									<button
										className="remove-person"
										onClick={() => removePerson(person.id)}
									>
										×
									</button>
								)}
							</div>

							{splitType === "custom" && (
								<div className="custom-items">
									{person.customItems.map((item, idx) => (
										<div key={idx} className="custom-item">
											<input
												type="text"
												value={item.name}
												onChange={(e) =>
													updateCustomItem(
														person.id,
														idx,
														"name",
														e.target.value,
													)
												}
												placeholder="Item name"
											/>
											<div className="item-price">
												<span>$</span>
												<input
													type="number"
													value={item.price || ""}
													onChange={(e) =>
														updateCustomItem(
															person.id,
															idx,
															"price",
															e.target.value,
														)
													}
													placeholder="0"
												/>
											</div>
											<button
												className="remove-item"
												onClick={() => removeCustomItem(person.id, idx)}
											>
												×
											</button>
										</div>
									))}
									<button
										className="add-item-btn"
										onClick={() => addCustomItem(person.id)}
									>
										+ Add item
									</button>
								</div>
							)}

							<div className="person-total">
								<span>Total</span>
								<span className="amount">
									${calculatePersonTotal(person).toFixed(2)}
								</span>
							</div>
						</div>
					))}

					<div className="add-person">
						<input
							type="text"
							placeholder="Add person..."
							value={newPersonName}
							onChange={(e) => setNewPersonName(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addPerson()}
						/>
						<button onClick={addPerson}>+</button>
					</div>
				</div>

				<div className="divider"></div>

				<div className="totals-section">
					<div className="total-row">
						<span>Subtotal</span>
						<span>${subtotal.toFixed(2)}</span>
					</div>
					<div className="total-row">
						<span>Tip ({effectiveTip}%)</span>
						<span>${tipAmount.toFixed(2)}</span>
					</div>
					<div className="total-row grand-total">
						<span>Total</span>
						<span>${total.toFixed(2)}</span>
					</div>
				</div>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #1a1a1a;
          color: #e8e8e8;
          padding: 1.5rem;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.85rem;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: #f5f5f5;
          letter-spacing: -0.5px;
        }

        .header p {
          color: #888;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .receipt {
          background: #fafafa;
          color: #222;
          max-width: 400px;
          margin: 0 auto;
          border-radius: 4px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.4);
          padding: 1.5rem;
          position: relative;
        }

        .receipt::before,
        .receipt::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 10px;
          background: radial-gradient(circle, transparent 50%, #1a1a1a 50%);
          background-size: 20px 20px;
        }

        .receipt::before {
          top: -10px;
        }

        .receipt::after {
          bottom: -10px;
        }

        .receipt-header {
          text-align: center;
          border-bottom: 2px dashed #ddd;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .receipt-title {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .bill-input-section,
        .tip-section,
        .people-section {
          margin-bottom: 1rem;
        }

        .bill-input-section label,
        .tip-section label,
        .people-section label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .input-with-prefix {
          display: flex;
          align-items: center;
          border: 2px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .prefix {
          background: #eee;
          padding: 0.6rem 0.8rem;
          font-weight: 600;
          color: #555;
        }

        .input-with-prefix input {
          flex: 1;
          border: none;
          padding: 0.6rem;
          font-size: 1.2rem;
          font-family: inherit;
          outline: none;
        }

        .tip-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tip-btn {
          flex: 1;
          min-width: 50px;
          padding: 0.5rem;
          border: 2px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          transition: all 0.15s;
        }

        .tip-btn:hover {
          border-color: #4a4a4a;
        }

        .tip-btn.active {
          background: #222;
          color: white;
          border-color: #222;
        }

        .custom-tip {
          width: 60px;
          padding: 0.5rem !important;
          border: 2px solid #ddd !important;
          border-radius: 4px !important;
          font-family: inherit !important;
          text-align: center;
        }

        .split-toggle {
          display: flex;
          gap: 0;
          margin-bottom: 1rem;
          border: 2px solid #222;
          border-radius: 4px;
          overflow: hidden;
        }

        .split-toggle button {
          flex: 1;
          padding: 0.6rem;
          border: none;
          background: white;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.15s;
        }

        .split-toggle button.active {
          background: #222;
          color: white;
        }

        .divider {
          border-top: 2px dashed #ddd;
          margin: 1rem 0;
        }

        .person-card {
          background: #f5f5f5;
          border-radius: 4px;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .person-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .person-name {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.25rem;
          outline: none;
        }

        .remove-person {
          background: none;
          border: none;
          color: #999;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 0.5rem;
        }

        .remove-person:hover {
          color: #d32f2f;
        }

        .custom-items {
          margin-bottom: 0.5rem;
        }

        .custom-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .custom-item input[type="text"] {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 2px;
          padding: 0.3rem;
          font-size: 0.75rem;
          font-family: inherit;
        }

        .item-price {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 2px;
          padding: 0 0.3rem;
        }

        .item-price span {
          color: #888;
          font-size: 0.75rem;
        }

        .item-price input {
          width: 40px;
          border: none;
          padding: 0.3rem;
          font-size: 0.75rem;
          font-family: inherit;
          text-align: right;
          outline: none;
        }

        .remove-item {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 1rem;
        }

        .remove-item:hover {
          color: #d32f2f;
        }

        .add-item-btn {
          background: none;
          border: none;
          color: #666;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.25rem;
          font-family: inherit;
        }

        .add-item-btn:hover {
          color: #222;
        }

        .person-total {
          display: flex;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid #ddd;
          font-weight: 600;
        }

        .person-total .amount {
          color: #222;
        }

        .add-person {
          display: flex;
          gap: 0.5rem;
        }

        .add-person input {
          flex: 1;
          border: 2px dashed #ddd;
          border-radius: 4px;
          padding: 0.6rem;
          font-family: inherit;
          font-size: 0.85rem;
        }

        .add-person button {
          background: #222;
          color: white;
          border: none;
          border-radius: 4px;
          width: 40px;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .totals-section {
          font-size: 0.85rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0;
          color: #555;
        }

        .total-row.grand-total {
          font-size: 1rem;
          font-weight: 700;
          color: #222;
          padding-top: 0.5rem;
          border-top: 2px solid #222;
          margin-top: 0.5rem;
        }
      `}</style>
		</div>
	);
}
