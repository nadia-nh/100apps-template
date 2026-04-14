import { useState } from "react";
import { Link } from "react-router-dom";

export default function TipQuick() {
	const [bill, setBill] = useState("");
	const [tip, setTip] = useState(18);
	const [split, setSplit] = useState(1);
	const amount = parseFloat(bill) || 0;
	const tipAmount = (amount * tip) / 100;
	const total = amount + tipAmount;
	const perPerson = total / split;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f8f5f0",
				color: "#2d2a26",
				padding: "1.5rem",
				fontFamily: " Georgia,serif",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(45,42,38,0.5)",
					textDecoration: "none",
					fontFamily: " system-ui",
				}}
			>
				← Back
			</Link>
			<h1
				style={{
					textAlign: "center",
					fontSize: "1.8rem",
					margin: "0 0 0.5rem",
					fontStyle: "italic",
				}}
			>
				Tip Quick
			</h1>
			<p
				style={{
					textAlign: "center",
					color: "rgba(45,42,38,0.5)",
					marginBottom: "2rem",
					fontFamily: " system-ui",
				}}
			>
				Calculate tips in seconds
			</p>
			<div
				style={{
					background: "white",
					borderRadius: "1rem",
					padding: "1.5rem",
					boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
					maxWidth: 360,
					margin: "0 auto",
				}}
			>
				<div style={{ marginBottom: "1.5rem" }}>
					<label
						style={{
							display: "block",
							fontSize: "0.75rem",
							textTransform: "uppercase",
							letterSpacing: 1,
							color: "rgba(45,42,38,0.5)",
							marginBottom: "0.5rem",
							fontFamily: " system-ui",
						}}
					>
						Bill Amount
					</label>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							border: "2px solid #ddd",
							borderRadius: "0.5rem",
						}}
					>
						<span
							style={{
								padding: "0.75rem",
								background: "#f5f5f5",
								color: "#666",
								fontWeight: 600,
							}}
						>
							$
						</span>
						<input
							type="number"
							value={bill}
							onChange={(e) => setBill(e.target.value)}
							placeholder="0.00"
							style={{
								flex: 1,
								padding: "0.75rem",
								border: "none",
								fontSize: "1.2rem",
								fontFamily: " inherit",
								outline: "none",
							}}
						/>
					</div>
				</div>
				<div style={{ marginBottom: "1.5rem" }}>
					<label
						style={{
							display: "block",
							fontSize: "0.75rem",
							textTransform: "uppercase",
							letterSpacing: 1,
							color: "rgba(45,42,38,0.5)",
							marginBottom: "0.5rem",
							fontFamily: " system-ui",
						}}
					>
						Tip %
					</label>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						{[15, 18, 20, 25].map((t) => (
							<button
								key={t}
								onClick={() => setTip(t)}
								style={{
									flex: 1,
									padding: "0.6rem",
									background: tip === t ? "#8b5a2b" : "#f5f5f5",
									color: tip === t ? "white" : "#666",
									border: "none",
									borderRadius: "0.5rem",
									fontWeight: 600,
									cursor: "pointer",
									fontFamily: " system-ui",
								}}
							>
								{t}%
							</button>
						))}
					</div>
				</div>
				<div style={{ marginBottom: "1.5rem" }}>
					<label
						style={{
							display: "block",
							fontSize: "0.75rem",
							textTransform: "uppercase",
							letterSpacing: 1,
							color: "rgba(45,42,38,0.5)",
							marginBottom: "0.5rem",
							fontFamily: " system-ui",
						}}
					>
						Split
					</label>
					<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
						<button
							onClick={() => setSplit(Math.max(1, split - 1))}
							style={{
								width: 40,
								height: 40,
								borderRadius: "50%",
								background: "#f5f5f5",
								border: "none",
								fontSize: "1.2rem",
								cursor: "pointer",
							}}
						>
							-
						</button>
						<span
							style={{
								fontSize: "1.5rem",
								fontWeight: 600,
								minWidth: 40,
								textAlign: "center",
							}}
						>
							{split}
						</span>
						<button
							onClick={() => setSplit(split + 1)}
							style={{
								width: 40,
								height: 40,
								borderRadius: "50%",
								background: "#f5f5f5",
								border: "none",
								fontSize: "1.2rem",
								cursor: "pointer",
							}}
						>
							+
						</button>
					</div>
				</div>
				<div style={{ borderTop: "2px dashed #ddd", paddingTop: "1.5rem" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "0.5rem",
							color: "rgba(45,42,38,0.6)",
						}}
					>
						<span>Subtotal</span>
						<span>${amount.toFixed(2)}</span>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "0.5rem",
							color: "rgba(45,42,38,0.6)",
						}}
					>
						<span>Tip ({tip}%)</span>
						<span>${tipAmount.toFixed(2)}</span>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							fontSize: "1.2rem",
							fontWeight: 700,
							color: "#8b5a2b",
							paddingTop: "0.5rem",
							borderTop: "2px solid #8b5a2b",
							marginTop: "0.5rem",
						}}
					>
						<span>Total</span>
						<span>${total.toFixed(2)}</span>
					</div>
					{split > 1 && (
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginTop: "1rem",
								padding: "0.75rem",
								background: "#f5f0e8",
								borderRadius: "0.5rem",
								fontWeight: 600,
							}}
						>
							<span>Per Person</span>
							<span>${perPerson.toFixed(2)}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
