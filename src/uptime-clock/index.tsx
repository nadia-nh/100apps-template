import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Uptime {
	id: number;
	name: string;
	target: string;
	hours: number;
	minutes: number;
}

export default function UptimeClock() {
	const [uptimes, setUptimes] = useState<Uptime[]>(() => {
		const saved = localStorage.getItem("uptime-clock");
		return saved ? JSON.parse(saved) : [];
	});
	const [newName, setNewName] = useState("");
	const [newHours, setNewHours] = useState(17);
	const [newMinutes, setNewMinutes] = useState(0);
	const [showAdd, setShowAdd] = useState(false);

	useEffect(() => {
		localStorage.setItem("uptime-clock", JSON.stringify(uptimes));
	}, [uptimes]);

	const addUptime = () => {
		if (!newName.trim()) return;
		setUptimes([
			...uptimes,
			{
				id: Date.now(),
				name: newName,
				target: "",
				hours: newHours,
				minutes: newMinutes,
			},
		]);
		setNewName("");
		setShowAdd(false);
	};

	const deleteUptime = (id: number) => {
		setUptimes(uptimes.filter((u) => u.id !== id));
	};

	const getTimeRemaining = (hours: number, minutes: number) => {
		const now = new Date();
		const target = new Date();
		target.setHours(hours, minutes, 0, 0);
		if (target <= now) target.setDate(target.getDate() + 1);
		const diff = target.getTime() - now.getTime();
		const h = Math.floor(diff / (1000 * 60 * 60));
		const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const s = Math.floor((diff % (1000 * 60)) / 1000);
		return { h, m, s };
	};

	const [, setTick] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => setTick((t) => t + 1), 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#000",
				color: "#0f0",
				padding: "2rem",
				fontFamily: "'Courier New', monospace",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "#0f0",
					textDecoration: "none",
					opacity: 0.5,
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
						color: "#0f0",
						textShadow: "0 0 10px #0f0",
					}}
				>
					UPTIME CLOCK
				</h1>
				<p
					style={{
						textAlign: "center",
						opacity: 0.5,
						marginBottom: "2rem",
						color: "#0f0",
					}}
				>
					Time until...
				</p>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 8,
						border: "1px dashed #0f0",
						background: "transparent",
						color: "#0f0",
						cursor: "pointer",
						marginBottom: "1.5rem",
						fontFamily: "inherit",
					}}
				>
					+ ADD TIMER
				</button>

				{showAdd && (
					<div
						style={{
							background: "#0a0a0a",
							border: "1px solid #0f0",
							borderRadius: 8,
							padding: "1rem",
							marginBottom: "1.5rem",
						}}
					>
						<input
							type="text"
							placeholder="Label"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 4,
								border: "1px solid #0f0",
								background: "#000",
								color: "#0f0",
								marginBottom: "0.5rem",
								fontFamily: "inherit",
							}}
						/>
						<div
							style={{
								display: "flex",
								gap: "0.5rem",
								marginBottom: "0.75rem",
							}}
						>
							<input
								type="number"
								min="0"
								max="23"
								value={newHours}
								onChange={(e) => setNewHours(Number(e.target.value))}
								style={{
									flex: 1,
									padding: "0.75rem",
									borderRadius: 4,
									border: "1px solid #0f0",
									background: "#000",
									color: "#0f0",
									textAlign: "center",
									fontFamily: "inherit",
								}}
							/>
							<span style={{ alignSelf: "center", color: "#0f0" }}>:</span>
							<input
								type="number"
								min="0"
								max="59"
								value={newMinutes}
								onChange={(e) => setNewMinutes(Number(e.target.value))}
								style={{
									flex: 1,
									padding: "0.75rem",
									borderRadius: 4,
									border: "1px solid #0f0",
									background: "#000",
									color: "#0f0",
									textAlign: "center",
									fontFamily: "inherit",
								}}
							/>
						</div>
						<button
							onClick={addUptime}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 4,
								border: "none",
								background: "#0f0",
								color: "#000",
								cursor: "pointer",
								fontWeight: "bold",
								fontFamily: "inherit",
							}}
						>
							CREATE
						</button>
					</div>
				)}

				{uptimes.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, color: "#0f0" }}>
						NO TIMERS
					</p>
				)}

				{uptimes.map((u) => {
					const remaining = getTimeRemaining(u.hours, u.minutes);
					return (
						<div
							key={u.id}
							style={{
								background: "#0a0a0a",
								border: "1px solid #0f0",
								borderRadius: 8,
								padding: "1.5rem",
								marginBottom: "1rem",
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
									<h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f0" }}>
										{u.name}
									</h3>
									<p
										style={{
											margin: "0.25rem 0 0",
											fontSize: "0.85rem",
											opacity: 0.5,
											color: "#0f0",
										}}
									>
										{u.hours.toString().padStart(2, "0")}:
										{u.minutes.toString().padStart(2, "0")}
									</p>
								</div>
								<button
									onClick={() => deleteUptime(u.id)}
									style={{
										background: "transparent",
										border: "none",
										color: "#0f0",
										cursor: "pointer",
										fontSize: "1.5rem",
										opacity: 0.5,
									}}
								>
									×
								</button>
							</div>
							<p
								style={{
									margin: "1rem 0 0",
									fontSize: "2.5rem",
									fontWeight: "bold",
									color: "#0f0",
									textShadow: "0 0 20px #0f0",
									textAlign: "center",
								}}
							>
								{remaining.h.toString().padStart(2, "0")}:
								{remaining.m.toString().padStart(2, "0")}:
								{remaining.s.toString().padStart(2, "0")}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
