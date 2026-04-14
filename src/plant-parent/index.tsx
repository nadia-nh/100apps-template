import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Plant {
	id: string;
	name: string;
	species: string;
	wateringDays: number;
	lastWatered: string;
	photo?: string;
}

export default function PlantParent() {
	const [plants, setPlants] = useState<Plant[]>(() => {
		const saved = localStorage.getItem("plant-parent");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAddPlant, setShowAddPlant] = useState(false);
	const [newPlant, setNewPlant] = useState({
		name: "",
		species: "",
		wateringDays: 7,
	});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

	useEffect(() => {
		localStorage.setItem("plant-parent", JSON.stringify(plants));
	}, [plants]);

	const today = new Date().toISOString().split("T")[0];

	const getDaysUntilWater = (plant: Plant) => {
		const last = new Date(plant.lastWatered);
		const next = new Date(last);
		next.setDate(last.getDate() + plant.wateringDays);
		const diff = Math.ceil(
			(next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
		);
		return diff;
	};

	const getStatusColor = (days: number) => {
		if (days < 0) return "#ef4444";
		if (days <= 1) return "#f59e0b";
		return "#22c55e";
	};

	const waterPlant = (id: string) => {
		setPlants(
			plants.map((p) => (p.id === id ? { ...p, lastWatered: today } : p)),
		);
	};

	const deletePlant = (id: string) => {
		setPlants(plants.filter((p) => p.id !== id));
	};

	const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedPhoto(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const addPlant = () => {
		if (!newPlant.name.trim()) return;

		const plant: Plant = {
			id: Date.now().toString(),
			name: newPlant.name.trim(),
			species: newPlant.species.trim() || "Unknown",
			wateringDays: newPlant.wateringDays,
			lastWatered: today,
			photo: selectedPhoto || undefined,
		};

		setPlants([...plants, plant]);
		setNewPlant({ name: "", species: "", wateringDays: 7 });
		setSelectedPhoto(null);
		setShowAddPlant(false);
	};

	const overduePlants = plants.filter((p) => getDaysUntilWater(p) < 0);
	const dueSoon = plants.filter(
		(p) => getDaysUntilWater(p) <= 1 && getDaysUntilWater(p) >= 0,
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Plant Parent</h1>
				<p>
					{plants.length} plants • {overduePlants.length} thirsty
				</p>
			</div>

			{overduePlants.length > 0 && (
				<div className="alert-section alert">
					<span className="alert-icon">💧</span>
					<span>Thirsty: {overduePlants.map((p) => p.name).join(", ")}</span>
				</div>
			)}

			{dueSoon.length > 0 && (
				<div className="alert-section warning">
					<span className="alert-icon">⚠️</span>
					<span>Due soon: {dueSoon.map((p) => p.name).join(", ")}</span>
				</div>
			)}

			<div className="plants-grid">
				{plants.map((plant) => {
					const days = getDaysUntilWater(plant);
					return (
						<div key={plant.id} className="plant-card">
							<div
								className="plant-photo"
								style={{
									background: plant.photo ? `url(${plant.photo})` : "#2d4a3e",
								}}
							>
								{!plant.photo && <span className="plant-emoji">🌿</span>}
								<button
									className="water-btn"
									onClick={() => waterPlant(plant.id)}
								>
									💧
								</button>
							</div>
							<div className="plant-info">
								<h3>{plant.name}</h3>
								<p className="species">{plant.species}</p>
								<div className="water-status">
									<div
										className="status-dot"
										style={{ background: getStatusColor(days) }}
									/>
									<span>
										{days < 0
											? `Overdue by ${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""}`
											: days === 0
												? "Water today"
												: `Water in ${days} day${days > 1 ? "s" : ""}`}
									</span>
								</div>
								<button
									className="delete-plant"
									onClick={() => deletePlant(plant.id)}
								>
									Remove
								</button>
							</div>
						</div>
					);
				})}

				<button
					className="add-plant-card"
					onClick={() => setShowAddPlant(true)}
				>
					<span className="plus">+</span>
					<span>Add Plant</span>
				</button>
			</div>

			{showAddPlant && (
				<div className="modal">
					<div className="modal-content">
						<button className="close" onClick={() => setShowAddPlant(false)}>
							×
						</button>
						<h2>Add New Plant</h2>

						<div
							className="photo-picker"
							onClick={() => fileInputRef.current?.click()}
						>
							{selectedPhoto ? (
								<img src={selectedPhoto} alt="Plant" />
							) : (
								<span>📷 Add Photo</span>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handlePhotoSelect}
								hidden
							/>
						</div>

						<div className="form-group">
							<label>Name</label>
							<input
								type="text"
								placeholder="e.g., Monstera"
								value={newPlant.name}
								onChange={(e) =>
									setNewPlant({ ...newPlant, name: e.target.value })
								}
							/>
						</div>

						<div className="form-group">
							<label>Species</label>
							<input
								type="text"
								placeholder="e.g., Monstera deliciosa"
								value={newPlant.species}
								onChange={(e) =>
									setNewPlant({ ...newPlant, species: e.target.value })
								}
							/>
						</div>

						<div className="form-group">
							<label>Water every (days)</label>
							<input
								type="number"
								min="1"
								max="30"
								value={newPlant.wateringDays}
								onChange={(e) =>
									setNewPlant({
										...newPlant,
										wateringDays: parseInt(e.target.value) || 7,
									})
								}
							/>
						</div>

						<button className="save-btn" onClick={addPlant}>
							Save Plant
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #0f1412;
          color: #e8f5e9;
          padding: 1.5rem;
          font-family: 'Outfit', system-ui, sans-serif;
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
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .alert-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .alert-section.alert {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .alert-section.warning {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .plants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }

        .plant-card {
          background: #1a2622;
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.2s;
        }

        .plant-card:hover {
          transform: translateY(-4px);
        }

        .plant-photo {
          height: 120px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 0.5rem;
        }

        .plant-emoji {
          font-size: 3rem;
        }

        .water-btn {
          background: #22c55e;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .water-btn:hover {
          transform: scale(1.1);
        }

        .plant-info {
          padding: 1rem;
        }

        .plant-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .species {
          margin: 0.25rem 0 0.75rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          font-style: italic;
        }

        .water-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .delete-plant {
          margin-top: 0.75rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
        }

        .delete-plant:hover {
          color: #ef4444;
        }

        .add-plant-card {
          background: rgba(34, 197, 94, 0.1);
          border: 2px dashed rgba(34, 197, 94, 0.3);
          border-radius: 1rem;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          color: rgba(34, 197, 94, 0.7);
          transition: all 0.2s;
        }

        .add-plant-card:hover {
          border-color: rgba(34, 197, 94, 0.5);
          background: rgba(34, 197, 94, 0.15);
        }

        .plus {
          font-size: 2rem;
          font-weight: 300;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          background: #1a2622;
          border-radius: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 360px;
          position: relative;
        }

        .close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-content h2 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
        }

        .photo-picker {
          width: 100%;
          height: 120px;
          background: rgba(255,255,255,0.05);
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .photo-picker img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-picker span {
          color: rgba(255,255,255,0.5);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        .save-btn {
          width: 100%;
          padding: 0.85rem;
          background: #22c55e;
          border: none;
          border-radius: 0.75rem;
          color: #0f1412;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
        }
      `}</style>
		</div>
	);
}
