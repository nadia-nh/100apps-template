import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Package {
	id: number;
	tracking: string;
	carrier: string;
	status: "ordered" | "shipped" | "out" | "delivered";
	name: string;
}

export default function PackTrack() {
	const [packages, setPackages] = useState<Package[]>(() => {
		const saved = localStorage.getItem("packages");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("packages", JSON.stringify(packages));
	}, [packages]);

	const addPackage = (name: string, carrier: string, tracking: string) => {
		setPackages([
			{ id: Date.now(), name, carrier, tracking, status: "ordered" },
			...packages,
		]);
	};

	const updateStatus = (id: number, status: Package["status"]) => {
		setPackages(packages.map((p) => (p.id === id ? { ...p, status } : p)));
	};

	const deletePackage = (id: number) => {
		setPackages(packages.filter((p) => p.id !== id));
	};

	const statusColors = {
		ordered: "#f59e0b",
		shipped: "#3b82f6",
		out: "#8b5cf6",
		delivered: "#22c55e",
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f3f4f6",
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
					Pack Track
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track your packages
				</p>

				<AddPackageForm onAdd={addPackage} />

				<div style={{ marginTop: "1.5rem" }}>
					{packages.length === 0 && (
						<p style={{ textAlign: "center", opacity: 0.3 }}>
							No packages tracked
						</p>
					)}
					{packages.map((p) => (
						<div
							key={p.id}
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
									<p style={{ margin: 0, fontWeight: "bold" }}>{p.name}</p>
									<p
										style={{
											margin: "0.25rem 0",
											fontSize: "0.8rem",
											opacity: 0.6,
										}}
									>
										{p.carrier} · {p.tracking}
									</p>
								</div>
								<button
									onClick={() => deletePackage(p.id)}
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
								style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}
							>
								{(["ordered", "shipped", "out", "delivered"] as const).map(
									(s) => (
										<button
											key={s}
											onClick={() => updateStatus(p.id, s)}
											style={{
												flex: 1,
												padding: "0.4rem",
												borderRadius: 6,
												border: "none",
												background:
													p.status === s ? statusColors[s] : "#e5e7eb",
												color: p.status === s ? "white" : "#6b7280",
												cursor: "pointer",
												fontSize: "0.7rem",
												textTransform: "capitalize",
											}}
										>
											{s === "out" ? "Out" : s}
										</button>
									),
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function AddPackageForm({
	onAdd,
}: {
	onAdd: (name: string, carrier: string, tracking: string) => void;
}) {
	const [name, setName] = useState("");
	const [carrier, setCarrier] = useState("USPS");
	const [tracking, setTracking] = useState("");

	const handleSubmit = () => {
		if (!name || !tracking) return;
		onAdd(name, carrier, tracking);
		setName("");
		setTracking("");
	};

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
				placeholder="Package name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e5e7eb",
					marginBottom: "0.5rem",
				}}
			/>
			<select
				value={carrier}
				onChange={(e) => setCarrier(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e5e7eb",
					marginBottom: "0.5rem",
				}}
			>
				<option value="USPS">USPS</option>
				<option value="UPS">UPS</option>
				<option value="FedEx">FedEx</option>
				<option value="Amazon">Amazon</option>
				<option value="Other">Other</option>
			</select>
			<input
				type="text"
				placeholder="Tracking number"
				value={tracking}
				onChange={(e) => setTracking(e.target.value)}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e5e7eb",
					marginBottom: "0.75rem",
				}}
			/>
			<button
				onClick={handleSubmit}
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
				Track Package
			</button>
		</div>
	);
}
