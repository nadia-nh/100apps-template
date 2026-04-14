import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Service {
	id: number;
	type: string;
	date: string;
	mileage: number;
	cost: number;
}

export default function CarCare() {
	const [services, setServices] = useState<Service[]>(() => {
		const saved = localStorage.getItem("car-services");
		return saved ? JSON.parse(saved) : [];
	});
	const [currentMileage, setCurrentMileage] = useState(() => {
		const saved = localStorage.getItem("car-mileage");
		return saved ? Number(saved) : 50000;
	});

	useEffect(() => {
		localStorage.setItem("car-services", JSON.stringify(services));
		localStorage.setItem("car-mileage", String(currentMileage));
	}, [services, currentMileage]);

	const addService = (
		type: string,
		date: string,
		mileage: number,
		cost: number,
	) => {
		setServices([{ id: Date.now(), type, date, mileage, cost }, ...services]);
	};

	const deleteService = (id: number) => {
		setServices(services.filter((s) => s.id !== id));
	};

	const serviceTypes = [
		"Oil Change",
		"Tire Rotation",
		"Brakes",
		"Air Filter",
		"Transmission",
		"Inspection",
		"Other",
	];
	const totalSpent = services.reduce((a, s) => a + s.cost, 0);
	const lastOil = services.filter((s) => s.type === "Oil Change")[0];
	const milesSinceOil = lastOil ? currentMileage - lastOil.mileage : 0;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#18181b",
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
					Car Care
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Vehicle maintenance log
				</p>

				<div
					style={{
						background: "#27272a",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.6 }}>
						Current Mileage
					</p>
					<input
						type="number"
						value={currentMileage}
						onChange={(e) => setCurrentMileage(Number(e.target.value))}
						style={{
							width: "100%",
							padding: "0.5rem",
							borderRadius: 8,
							border: "none",
							background: "#18181b",
							color: "white",
							fontSize: "1.5rem",
							fontWeight: "bold",
							textAlign: "center",
							marginTop: "0.25rem",
						}}
					/>
				</div>

				<div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
					<div
						style={{
							flex: 1,
							background: milesSinceOil > 5000 ? "#dc2626" : "#27272a",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
							Miles Since Oil
						</p>
						<p
							style={{
								margin: "0.25rem 0",
								fontSize: "1.5rem",
								fontWeight: "bold",
							}}
						>
							{milesSinceOil.toLocaleString()}
						</p>
					</div>
					<div
						style={{
							flex: 1,
							background: "#27272a",
							borderRadius: 12,
							padding: "1rem",
							textAlign: "center",
						}}
					>
						<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
							Total Spent
						</p>
						<p
							style={{
								margin: "0.25rem 0",
								fontSize: "1.5rem",
								fontWeight: "bold",
							}}
						>
							${totalSpent.toLocaleString()}
						</p>
					</div>
				</div>

				<AddServiceForm onAdd={addService} types={serviceTypes} />

				<h2
					style={{
						fontSize: "1.1rem",
						marginTop: "1.5rem",
						marginBottom: "1rem",
						opacity: 0.8,
					}}
				>
					Service History
				</h2>
				{services.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>
						No services logged
					</p>
				)}

				{services.map((s) => (
					<div
						key={s.id}
						style={{
							background: "#27272a",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div>
							<p style={{ margin: 0, fontWeight: "bold" }}>{s.type}</p>
							<p
								style={{
									margin: "0.25rem 0",
									fontSize: "0.8rem",
									opacity: 0.6,
								}}
							>
								{s.date} · {s.mileage.toLocaleString()} mi
							</p>
						</div>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<span style={{ fontWeight: "bold" }}>${s.cost}</span>
							<button
								onClick={() => deleteService(s.id)}
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

function AddServiceForm({
	onAdd,
	types,
}: {
	onAdd: (type: string, date: string, mileage: number, cost: number) => void;
	types: string[];
}) {
	const [type, setType] = useState(types[0]);
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [mileage, setMileage] = useState("");
	const [cost, setCost] = useState("");

	return (
		<div style={{ background: "#27272a", borderRadius: 12, padding: "1rem" }}>
			<select
				value={type}
				onChange={(e) => setType(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#18181b",
					color: "white",
					marginBottom: "0.5rem",
				}}
			>
				{types.map((t) => (
					<option key={t} value={t}>
						{t}
					</option>
				))}
			</select>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "none",
						background: "#18181b",
						color: "white",
					}}
				/>
				<input
					type="number"
					placeholder="Mileage"
					value={mileage}
					onChange={(e) => setMileage(e.target.value)}
					style={{
						flex: 1,
						padding: "0.75rem",
						borderRadius: 8,
						border: "none",
						background: "#18181b",
						color: "white",
					}}
				/>
			</div>
			<input
				type="number"
				placeholder="Cost $"
				value={cost}
				onChange={(e) => setCost(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#18181b",
					color: "white",
					marginBottom: "0.75rem",
				}}
			/>
			<button
				onClick={() => {
					if (mileage && cost) {
						onAdd(type, date, Number(mileage), Number(cost));
						setMileage("");
						setCost("");
					}
				}}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#3b82f6",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Log Service
			</button>
		</div>
	);
}
