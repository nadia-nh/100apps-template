import { useState } from "react";
import { Link } from "react-router-dom";

interface TimeBlock {
	id: string;
	day: number;
	startHour: number;
	endHour: number;
	label: string;
	color: string;
}

const categories = [
	{ label: "Work", color: "#3b82f6" },
	{ label: "Exercise", color: "#22c55e" },
	{ label: "Rest", color: "#a855f7" },
	{ label: "Meeting", color: "#f59e0b" },
	{ label: "Focus", color: "#ef4444" },
	{ label: "Personal", color: "#ec4899" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TimeBlock() {
	const [blocks, setBlocks] = useState<TimeBlock[]>([]);
	const [selectedBlock, setSelectedBlock] = useState<{
		day: number;
		hour: number;
	} | null>(null);
	const [newBlock, setNewBlock] = useState({
		label: "Work",
		startHour: 9,
		endHour: 10,
	});

	const handleCellClick = (day: number, hour: number) => {
		setSelectedBlock({ day, hour });
	};

	const addBlock = () => {
		if (!selectedBlock) return;
		const category = categories.find((c) => c.label === newBlock.label)!;
		const newTimeBlock: TimeBlock = {
			id: Date.now().toString(),
			day: selectedBlock.day,
			startHour: newBlock.startHour,
			endHour: newBlock.endHour,
			label: newBlock.label,
			color: category.color,
		};
		setBlocks([...blocks, newTimeBlock]);
		setSelectedBlock(null);
	};

	const deleteBlock = (id: string) => {
		setBlocks(blocks.filter((b) => b.id !== id));
	};

	const hours = Array.from({ length: 14 }, (_, i) => i + 7);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Time Block</h1>
				<p>Visual weekly planner</p>
			</div>

			<div className="calendar">
				<div className="calendar-header">
					<div className="time-col"></div>
					{days.map((d, i) => (
						<div key={i} className="day-header">
							{d}
						</div>
					))}
				</div>

				<div className="calendar-body">
					{hours.map((hour) => (
						<div key={hour} className="hour-row">
							<div className="time-label">{hour}:00</div>
							{days.map((_, dayIndex) => (
								<div
									key={dayIndex}
									className="day-cell"
									onClick={() => handleCellClick(dayIndex, hour)}
								>
									{blocks
										.filter(
											(b) =>
												b.day === dayIndex &&
												hour >= b.startHour &&
												hour < b.endHour,
										)
										.map((block) => (
											<div
												key={block.id}
												className="block"
												style={{ background: block.color }}
												onClick={(e) => {
													e.stopPropagation();
													deleteBlock(block.id);
												}}
											>
												{hour === block.startHour && block.label}
											</div>
										))}
								</div>
							))}
						</div>
					))}
				</div>
			</div>

			<div className="legend">
				{categories.map((cat) => (
					<div key={cat.label} className="legend-item">
						<span
							className="legend-dot"
							style={{ background: cat.color }}
						></span>
						<span>{cat.label}</span>
					</div>
				))}
			</div>

			{selectedBlock && (
				<div className="modal">
					<div className="modal-content">
						<button className="close" onClick={() => setSelectedBlock(null)}>
							×
						</button>
						<h2>Add Time Block</h2>
						<p className="time-preview">
							{days[selectedBlock.day]} at {selectedBlock.hour}:00
						</p>

						<div className="form-group">
							<label>Category</label>
							<select
								value={newBlock.label}
								onChange={(e) =>
									setNewBlock({ ...newBlock, label: e.target.value })
								}
							>
								{categories.map((c) => (
									<option key={c.label} value={c.label}>
										{c.label}
									</option>
								))}
							</select>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label>Start</label>
								<select
									value={newBlock.startHour}
									onChange={(e) =>
										setNewBlock({
											...newBlock,
											startHour: parseInt(e.target.value),
										})
									}
								>
									{hours.map((h) => (
										<option key={h} value={h}>
											{h}:00
										</option>
									))}
								</select>
							</div>
							<div className="form-group">
								<label>End</label>
								<select
									value={newBlock.endHour}
									onChange={(e) =>
										setNewBlock({
											...newBlock,
											endHour: parseInt(e.target.value),
										})
									}
								>
									{hours
										.filter((h) => h > newBlock.startHour)
										.map((h) => (
											<option key={h} value={h}>
												{h}:00
											</option>
										))}
								</select>
							</div>
						</div>

						<button className="save-btn" onClick={addBlock}>
							Add Block
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #1a1a2e;
          color: #e0e0e0;
          padding: 1rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          overflow-x: auto;
        }

        .back-button {
          position: fixed;
          top: 1rem;
          left: 1rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.8rem;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 1rem;
          padding-top: 0.5rem;
        }

        .header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .calendar {
          min-width: 600px;
          background: rgba(255,255,255,0.03);
          border-radius: 1rem;
          overflow: hidden;
        }

        .calendar-header {
          display: grid;
          grid-template-columns: 50px repeat(7, 1fr);
          background: rgba(255,255,255,0.05);
        }

        .time-col, .day-header {
          padding: 0.75rem 0.25rem;
          text-align: center;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .calendar-body {
          max-height: 60vh;
          overflow-y: auto;
        }

        .hour-row {
          display: grid;
          grid-template-columns: 50px repeat(7, 1fr);
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .time-label {
          padding: 0.5rem 0.25rem;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.3);
          text-align: right;
          padding-right: 0.5rem;
        }

        .day-cell {
          min-height: 40px;
          border-left: 1px solid rgba(255,255,255,0.05);
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
        }

        .day-cell:hover {
          background: rgba(255,255,255,0.05);
        }

        .block {
          position: absolute;
          left: 2px;
          right: 2px;
          border-radius: 4px;
          padding: 0.25rem;
          font-size: 0.65rem;
          color: white;
          font-weight: 500;
          overflow: hidden;
          cursor: pointer;
          z-index: 1;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          background: #1a1a2e;
          border-radius: 1rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 320px;
          position: relative;
        }

        .close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 1.25rem;
          cursor: pointer;
        }

        .modal-content h2 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }

        .time-preview {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 0.75rem;
        }

        .form-group label {
          display: block;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.25rem;
        }

        .form-group select {
          width: 100%;
          padding: 0.6rem;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.9rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .save-btn {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }
      `}</style>
		</div>
	);
}
