import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Appliance {
	id: number;
	name: string;
	purchaseDate: string;
	warrantyMonths: number;
	replacementCost: number;
}

export default function ApplianceAge() {
	const [appliances, setAppliances] = useState<Appliance[]>(() => {
		const saved = localStorage.getItem("appliances");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("appliances", JSON.stringify(appliances));
	}, [appliances]);

	const addAppliance = (
		name: string,
		purchaseDate: string,
		warrantyMonths: number,
		replacementCost: number,
	) => {
		setAppliances([
			...appliances,
			{ id: Date.now(), name, purchaseDate, warrantyMonths, replacementCost },
		]);
	};

	const deleteAppliance = (id: number) => {
		setAppliances(appliances.filter((a) => a.id !== id));
	};

	const getAge = (purchaseDate: string) => {
		const months = Math.floor(
			(Date.now() - new Date(purchaseDate).getTime()) /
				(1000 * 60 * 60 * 24 * 30),
		);
		return months;
	};

	const getWarrantyLeft = (purchaseDate: string, warrantyMonths: number) => {
		const age = getAge(purchaseDate);
		return Math.max(0, warrantyMonths - age);
	};

	const totalValue = appliances.reduce((a, a_) => a + a_.replacementCost, 0);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#fff7ed",
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
					Appliance Age
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track appliance ages & warranties
				</p>

				<AddApplianceForm onAdd={addAppliance} />

				<div
					style={{
						background: "#fdba74",
						borderRadius: 12,
						padding: "1rem",
						marginTop: "1.5rem",
						marginBottom: "1.5rem",
						textAlign: "center",
					}}
				>
					<p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
						Total Replacement Value
					</p>
					<p
						style={{
							margin: "0.25rem 0",
							fontSize: "2rem",
							fontWeight: "bold",
						}}
					>
						${totalValue.toLocaleString()}
					</p>
				</div>

				{appliances.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, marginTop: "1.5rem" }}>
						No appliances tracked
					</p>
				)}

				{appliances.map((a) => {
					const age = getAge(a.purchaseDate);
					const warrantyLeft = getWarrantyLeft(
						a.purchaseDate,
						a.warrantyMonths,
					);
					const years = Math.floor(age / 12);
					const months = age % 12;
					return (
						<div
							key={a.id}
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
										{a.name}
									</p>
									<p
										style={{
											margin: "0.25rem 0",
											fontSize: "0.8rem",
											opacity: 0.6,
										}}
									>
										Purchased: {a.purchaseDate}
									</p>
								</div>
								<button
									onClick={() => deleteAppliance(a.id)}
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
							<div
								style={{
									display: "flex",
									gap: "1rem",
									marginTop: "0.75rem",
									fontSize: "0.9rem",
								}}
							>
								<div>
									<span style={{ opacity: 0.6 }}>Age: </span>
									<span style={{ fontWeight: "bold" }}>
										{years}y {months}m
									</span>
								</div>
								<div>
									<span style={{ opacity: 0.6 }}>Warranty: </span>
									<span
										style={{
											fontWeight: "bold",
											color:
												warrantyLeft <= 0
													? "#ef4444"
													: warrantyLeft <= 3
														? "#f59e0b"
														: "#22c55e",
										}}
									>
										{warrantyLeft > 0 ? `${warrantyLeft}mo` : "Expired"}
									</span>
								</div>
								<div>
									<span style={{ opacity: 0.6 }}>Cost: </span>
									<span style={{ fontWeight: "bold" }}>
										${a.replacementCost}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function AddApplianceForm({
	onAdd,
}: {
	onAdd: (name: string, date: string, warranty: number, cost: number) => void;
}) {
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [warranty, setWarranty] = useState(12);
	const [cost, setCost] = useState("");

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
				placeholder="Appliance name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #fed7aa",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="date"
				value={date}
				onChange={(e) => setDate(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #fed7aa",
					marginBottom: "0.5rem",
				}}
			/>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
				<input
					type="number"
					placeholder="Warranty (months)"
					value={warranty}
					onChange={(e) => setWarranty(Number(e.target.value))}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "1px solid #fed7aa",
					}}
				/>
				<input
					type="number"
					placeholder="Cost $"
					value={cost}
					onChange={(e) => setCost(e.target.value)}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "1px solid #fed7aa",
					}}
				/>
			</div>
			<button
				onClick={() => {
					if (name && date && cost) {
						onAdd(name, date, warranty, Number(cost));
						setName("");
						setDate("");
						setCost("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#ea580c",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Add Appliance
			</button>
		</div>
	);
}
