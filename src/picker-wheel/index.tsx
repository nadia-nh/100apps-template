import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface WheelOption {
	id: string;
	label: string;
	weight: number;
	color: string;
}

interface SavedWheel {
	id: string;
	name: string;
	options: WheelOption[];
}

const defaultWheels: SavedWheel[] = [
	{
		id: "default-1",
		name: "Quick Decision",
		options: [
			{ id: "1", label: "Yes", weight: 1, color: "#ff6b6b" },
			{ id: "2", label: "No", weight: 1, color: "#4ecdc4" },
		],
	},
	{
		id: "default-2",
		name: "Dinner Choice",
		options: [
			{ id: "1", label: "Pizza", weight: 1, color: "#ffe66d" },
			{ id: "2", label: "Sushi", weight: 1, color: "#ff6b6b" },
			{ id: "3", label: "Tacos", weight: 1, color: "#4ecdc4" },
			{ id: "4", label: "Burgers", weight: 1, color: "#95e1d3" },
		],
	},
	{
		id: "default-3",
		name: "Team Activity",
		options: [
			{ id: "1", label: "Bowling", weight: 1, color: "#a8e6cf" },
			{ id: "2", label: "Mini Golf", weight: 1, color: "#ffd3b6" },
			{ id: "3", label: "Escape Room", weight: 1, color: "#ffaaa5" },
			{ id: "4", label: "Karaoke", weight: 1, color: "#d4a5a5" },
			{ id: "5", label: "Board Games", weight: 1, color: "#9b59b6" },
		],
	},
];

const vibrantColors = [
	"#ff6b6b",
	"#4ecdc4",
	"#ffe66d",
	"#95e1d3",
	"#f8b500",
	"#ff8c42",
	"#6c5ce7",
	"#a29bfe",
	"#fd79a8",
	"#00cec9",
	"#fdcb6e",
	"#e17055",
];

export default function PickerWheel() {
	const [wheels, setWheels] = useState<SavedWheel[]>(() => {
		const saved = localStorage.getItem("picker-wheels");
		return saved ? JSON.parse(saved) : defaultWheels;
	});
	const [selectedWheelId, setSelectedWheelId] = useState(wheels[0]?.id || "");
	const [currentWheel, setCurrentWheel] = useState<WheelOption | null>(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [spinHistory, setSpinHistory] = useState<
		{ result: string; time: Date }[]
	>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editingWheel, setEditingWheel] = useState<SavedWheel | null>(null);
	const [newWheelName, setNewWheelName] = useState("");
	const [newOptionLabel, setNewOptionLabel] = useState("");
	const wheelRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const selectedWheel =
		wheels.find((w) => w.id === selectedWheelId) || wheels[0];

	useEffect(() => {
		localStorage.setItem("picker-wheels", JSON.stringify(wheels));
	}, [wheels]);

	useEffect(() => {
		drawWheel();
	}, [selectedWheel, isSpinning]);

	const drawWheel = () => {
		const canvas = canvasRef.current;
		if (!canvas || !selectedWheel) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = Math.min(centerX, centerY) - 20;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const totalWeight = selectedWheel.options.reduce(
			(sum, opt) => sum + opt.weight,
			0,
		);
		let currentAngle = isSpinning ? Math.random() * Math.PI * 2 : 0;

		selectedWheel.options.forEach((option) => {
			const sliceAngle = (option.weight / totalWeight) * 2 * Math.PI;

			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(
				centerX,
				centerY,
				radius,
				currentAngle,
				currentAngle + sliceAngle,
			);
			ctx.closePath();
			ctx.fillStyle = option.color;
			ctx.fill();
			ctx.strokeStyle = "#1a1a2e";
			ctx.lineWidth = 3;
			ctx.stroke();

			const textAngle = currentAngle + sliceAngle / 2;
			const textRadius = radius * 0.65;
			const textX = centerX + Math.cos(textAngle) * textRadius;
			const textY = centerY + Math.sin(textAngle) * textRadius;

			ctx.save();
			ctx.translate(textX, textY);
			ctx.rotate(textAngle + Math.PI / 2);
			ctx.fillStyle = "#1a1a2e";
			ctx.font = "bold 16px 'Outfit', sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(option.label, 0, 0);
			ctx.restore();

			currentAngle += sliceAngle;
		});

		ctx.beginPath();
		ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
		ctx.fillStyle = "#1a1a2e";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
		ctx.fillStyle = "#fff";
		ctx.fill();
	};

	const spinWheel = () => {
		if (isSpinning || !selectedWheel) return;

		setIsSpinning(true);
		setShowResult(false);

		const totalWeight = selectedWheel.options.reduce(
			(sum, opt) => sum + opt.weight,
			0,
		);
		const rand = Math.random() * totalWeight;
		let cumulative = 0;
		let selectedIndex = 0;

		for (let i = 0; i < selectedWheel.options.length; i++) {
			cumulative += selectedWheel.options[i].weight;
			if (rand <= cumulative) {
				selectedIndex = i;
				break;
			}
		}

		const sliceAngle =
			(selectedWheel.options[selectedIndex].weight / totalWeight) * 2 * Math.PI;
		const baseRotations = 5 + Math.floor(Math.random() * 3);
		const targetAngle =
			baseRotations * 2 * Math.PI + (2 * Math.PI - sliceAngle / 2);

		let currentRotation = 0;
		const duration = 4000;
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeOut = 1 - (1 - progress) ** 3;
			currentRotation = targetAngle * easeOut;

			if (wheelRef.current) {
				wheelRef.current.style.transform = `rotate(${currentRotation}rad)`;
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsSpinning(false);
				setShowResult(true);
				setCurrentWheel(selectedWheel.options[selectedIndex]);
				setSpinHistory((prev) => [
					{
						result: selectedWheel.options[selectedIndex].label,
						time: new Date(),
					},
					...prev.slice(0, 9),
				]);
			}
		};

		requestAnimationFrame(animate);
	};

	const addWheel = () => {
		if (!newWheelName.trim()) return;
		const newWheel: SavedWheel = {
			id: `wheel-${Date.now()}`,
			name: newWheelName,
			options: [],
		};
		setWheels([...wheels, newWheel]);
		setSelectedWheelId(newWheel.id);
		setNewWheelName("");
		setIsEditing(true);
		setEditingWheel(newWheel);
	};

	const addOption = () => {
		if (!editingWheel || !newOptionLabel.trim()) return;
		const newOption: WheelOption = {
			id: `opt-${Date.now()}`,
			label: newOptionLabel,
			weight: 1,
			color: vibrantColors[editingWheel.options.length % vibrantColors.length],
		};
		const updatedWheel = {
			...editingWheel,
			options: [...editingWheel.options, newOption],
		};
		setEditingWheel(updatedWheel);
		setWheels(wheels.map((w) => (w.id === updatedWheel.id ? updatedWheel : w)));
		setNewOptionLabel("");
	};

	const removeOption = (optId: string) => {
		if (!editingWheel) return;
		const updatedWheel = {
			...editingWheel,
			options: editingWheel.options.filter((o) => o.id !== optId),
		};
		setEditingWheel(updatedWheel);
		setWheels(wheels.map((w) => (w.id === updatedWheel.id ? updatedWheel : w)));
	};

	const updateOptionWeight = (optId: string, weight: number) => {
		if (!editingWheel) return;
		const updatedWheel = {
			...editingWheel,
			options: editingWheel.options.map((o) =>
				o.id === optId ? { ...o, weight } : o,
			),
		};
		setEditingWheel(updatedWheel);
		setWheels(wheels.map((w) => (w.id === updatedWheel.id ? updatedWheel : w)));
	};

	const deleteWheel = (wheelId: string) => {
		const newWheels = wheels.filter((w) => w.id !== wheelId);
		setWheels(newWheels);
		if (selectedWheelId === wheelId && newWheels.length > 0) {
			setSelectedWheelId(newWheels[0].id);
		}
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="wheel-header">
				<h1>Picker Wheel</h1>
				<p>Spin to decide</p>
			</div>

			<div className="wheel-selector">
				<select
					value={selectedWheelId}
					onChange={(e) => {
						setSelectedWheelId(e.target.value);
						setShowResult(false);
						setCurrentWheel(null);
					}}
					disabled={isSpinning}
				>
					{wheels.map((wheel) => (
						<option key={wheel.id} value={wheel.id}>
							{wheel.name}
						</option>
					))}
				</select>
				<button
					className="edit-btn"
					onClick={() => {
						setEditingWheel(selectedWheel);
						setIsEditing(true);
					}}
				>
					Edit
				</button>
				<button
					className="new-btn"
					onClick={() => {
						setEditingWheel(null);
						setIsEditing(true);
					}}
				>
					+ New
				</button>
			</div>

			<div className="wheel-section">
				<div className="wheel-wrapper" ref={wheelRef}>
					<canvas
						ref={canvasRef}
						width={320}
						height={320}
						className="wheel-canvas"
					/>
					<div className="wheel-pointer">▼</div>
				</div>

				<button
					className={`spin-button ${isSpinning ? "spinning" : ""}`}
					onClick={spinWheel}
					disabled={isSpinning || selectedWheel?.options.length === 0}
				>
					{isSpinning ? "Spinning..." : "SPIN!"}
				</button>

				{showResult && currentWheel && (
					<div className="result-display">
						<span className="result-label">Result:</span>
						<span
							className="result-value"
							style={{ color: currentWheel.color }}
						>
							{currentWheel.label}
						</span>
					</div>
				)}
			</div>

			{spinHistory.length > 0 && (
				<div className="history-section">
					<h3>Recent Spins</h3>
					<div className="history-list">
						{spinHistory.map((item, i) => (
							<div key={i} className="history-item">
								<span className="history-result">{item.result}</span>
								<span className="history-time">
									{item.time.toLocaleTimeString()}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{isEditing && (
				<div className="modal-overlay" onClick={() => setIsEditing(false)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<h2>{editingWheel ? "Edit Wheel" : "Create New Wheel"}</h2>

						{!editingWheel ? (
							<div className="new-wheel-form">
								<input
									type="text"
									placeholder="Wheel name..."
									value={newWheelName}
									onChange={(e) => setNewWheelName(e.target.value)}
								/>
								<button onClick={addWheel}>Create</button>
							</div>
						) : (
							<>
								<div className="wheel-name-edit">
									<label>Name:</label>
									<input
										type="text"
										value={editingWheel.name}
										onChange={(e) => {
											const updated = { ...editingWheel, name: e.target.value };
											setEditingWheel(updated);
											setWheels(
												wheels.map((w) => (w.id === updated.id ? updated : w)),
											);
										}}
									/>
								</div>

								<div className="options-list">
									{editingWheel.options.map((opt) => (
										<div key={opt.id} className="option-item">
											<div
												className="option-color"
												style={{ background: opt.color }}
											/>
											<input
												type="text"
												value={opt.label}
												onChange={(e) => {
													const updated = {
														...editingWheel,
														options: editingWheel.options.map((o) =>
															o.id === opt.id
																? { ...o, label: e.target.value }
																: o,
														),
													};
													setEditingWheel(updated);
													setWheels(
														wheels.map((w) =>
															w.id === updated.id ? updated : w,
														),
													);
												}}
											/>
											<div className="weight-control">
												<button
													onClick={() =>
														updateOptionWeight(
															opt.id,
															Math.max(1, opt.weight - 1),
														)
													}
												>
													-
												</button>
												<span>{opt.weight}</span>
												<button
													onClick={() =>
														updateOptionWeight(opt.id, opt.weight + 1)
													}
												>
													+
												</button>
											</div>
											<button
												className="delete-opt"
												onClick={() => removeOption(opt.id)}
											>
												×
											</button>
										</div>
									))}
								</div>

								<div className="add-option-form">
									<input
										type="text"
										placeholder="Add option..."
										value={newOptionLabel}
										onChange={(e) => setNewOptionLabel(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && addOption()}
									/>
									<button onClick={addOption}>Add</button>
								</div>

								{wheels.length > 1 && (
									<button
										className="delete-wheel"
										onClick={() => {
											deleteWheel(editingWheel.id);
											setIsEditing(false);
										}}
									>
										Delete Wheel
									</button>
								)}
							</>
						)}

						<button className="close-modal" onClick={() => setIsEditing(false)}>
							Done
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #e8e8e8;
          padding: 1.5rem;
          font-family: 'Outfit', system-ui, sans-serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .back-button:hover {
          color: white;
        }

        .wheel-header {
          text-align: center;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .wheel-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          background: linear-gradient(90deg, #ff6b6b, #ffe66d, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .wheel-header p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        .wheel-selector {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .wheel-selector select {
          flex: 1;
          max-width: 200px;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          cursor: pointer;
        }

        .wheel-selector button {
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wheel-selector button:hover {
          background: rgba(255,255,255,0.2);
        }

        .wheel-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .wheel-wrapper {
          position: relative;
          width: 320px;
          height: 320px;
          margin-bottom: 1.5rem;
        }

        .wheel-canvas {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 
            0 0 0 8px rgba(255,255,255,0.1),
            0 0 40px rgba(78, 205, 196, 0.3),
            inset 0 0 60px rgba(0,0,0,0.3);
        }

        .wheel-pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2rem;
          color: #ffe66d;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          z-index: 10;
        }

        .spin-button {
          padding: 1rem 3rem;
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b6b, #ff8e53);
          border: none;
          border-radius: 3rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .spin-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(255, 107, 107, 0.5);
        }

        .spin-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin-button.spinning {
          animation: pulse 0.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .result-display {
          margin-top: 1.5rem;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.25rem;
        }

        .result-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .history-section {
          margin-top: 2rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .history-section h3 {
          margin: 0 0 0.75rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.5rem;
        }

        .history-result {
          font-weight: 500;
        }

        .history-time {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          background: #1a1a2e;
          border-radius: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .modal-content h2 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
        }

        .new-wheel-form, .add-option-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .new-wheel-form input, .add-option-form input {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          color: white;
        }

        .new-wheel-form button, .add-option-form button {
          padding: 0.75rem 1rem;
          background: #4ecdc4;
          border: none;
          border-radius: 0.5rem;
          color: #1a1a2e;
          font-weight: 600;
          cursor: pointer;
        }

        .wheel-name-edit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .wheel-name-edit label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        .wheel-name-edit input {
          flex: 1;
          padding: 0.5rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          color: white;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          max-height: 250px;
          overflow-y: auto;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.5rem;
        }

        .option-color {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .option-item input {
          flex: 1;
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: white;
          font-size: 0.9rem;
        }

        .weight-control {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .weight-control button {
          width: 24px;
          height: 24px;
          padding: 0;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 0.25rem;
          color: white;
          cursor: pointer;
          font-size: 1rem;
        }

        .weight-control span {
          min-width: 20px;
          text-align: center;
          font-size: 0.85rem;
        }

        .delete-opt {
          width: 24px;
          height: 24px;
          padding: 0;
          background: rgba(255,107,107,0.2);
          border: none;
          border-radius: 0.25rem;
          color: #ff6b6b;
          cursor: pointer;
          font-size: 1rem;
        }

        .delete-wheel {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,107,107,0.1);
          border: 1px solid rgba(255,107,107,0.3);
          border-radius: 0.5rem;
          color: #ff6b6b;
          cursor: pointer;
          margin-top: 1rem;
        }

        .close-modal {
          width: 100%;
          padding: 0.75rem;
          background: #4ecdc4;
          border: none;
          border-radius: 0.5rem;
          color: #1a1a2e;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }
      `}</style>
		</div>
	);
}
