import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Countdown {
	id: number;
	name: string;
	date: string;
	color: string;
}

export default function Countdown() {
	const [countdowns, setCountdowns] = useState<Countdown[]>(() => {
		const saved = localStorage.getItem("countdowns");
		return saved ? JSON.parse(saved) : [];
	});
	const [newName, setNewName] = useState("");
	const [newDate, setNewDate] = useState("");
	const [showAdd, setShowAdd] = useState(false);

	useEffect(() => {
		localStorage.setItem("countdowns", JSON.stringify(countdowns));
	}, [countdowns]);

	const addCountdown = () => {
		if (!newName.trim() || !newDate) return;
		const colors = ["#f472b6", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
		setCountdowns([
			...countdowns,
			{
				id: Date.now(),
				name: newName,
				date: newDate,
				color: colors[countdowns.length % colors.length],
			},
		]);
		setNewName("");
		setNewDate("");
		setShowAdd(false);
	};

	const deleteCountdown = (id: number) => {
		setCountdowns(countdowns.filter((c) => c.id !== id));
	};

	const getTimeRemaining = (date: string) => {
		const diff = new Date(date).getTime() - Date.now();
		if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return { days, hours, minutes, expired: false };
	};

	const [, setNow] = useState(Date.now());
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0f172a",
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
						marginBottom: "2rem",
					}}
				>
					Countdown
				</h1>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "2px dashed rgba(255,255,255,0.2)",
						background: "transparent",
						color: "rgba(255,255,255,0.5)",
						cursor: "pointer",
						marginBottom: "1.5rem",
						fontSize: "1rem",
					}}
				>
					+ Add Event
				</button>

				{showAdd && (
					<div
						style={{
							background: "#1e293b",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
						}}
					>
						<input
							type="text"
							placeholder="Event name"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#0f172a",
								color: "white",
								marginBottom: "0.5rem",
							}}
						/>
						<input
							type="datetime-local"
							value={newDate}
							onChange={(e) => setNewDate(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#0f172a",
								color: "white",
								marginBottom: "0.75rem",
							}}
						/>
						<button
							onClick={addCountdown}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#3b82f6",
								color: "white",
								cursor: "pointer",
								fontWeight: "bold",
							}}
						>
							Create
						</button>
					</div>
				)}

				{countdowns.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No countdowns yet</p>
				)}

				{countdowns.map((c) => {
					const remaining = getTimeRemaining(c.date);
					return (
						<div
							key={c.id}
							style={{
								background: "#1e293b",
								borderRadius: 16,
								padding: "1.5rem",
								marginBottom: "1rem",
								borderLeft: `4px solid ${c.color}`,
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
									<h3 style={{ margin: 0, fontSize: "1.2rem" }}>{c.name}</h3>
									<p
										style={{
											margin: "0.25rem 0 0",
											fontSize: "0.85rem",
											opacity: 0.5,
										}}
									>
										{new Date(c.date).toLocaleDateString()}
									</p>
								</div>
								<button
									onClick={() => deleteCountdown(c.id)}
									style={{
										background: "transparent",
										border: "none",
										color: "rgba(255,255,255,0.3)",
										cursor: "pointer",
										fontSize: "1.2rem",
									}}
								>
									×
								</button>
							</div>

							{remaining.expired ? (
								<p
									style={{
										margin: "1rem 0 0",
										fontSize: "1.5rem",
										fontWeight: "bold",
										color: c.color,
									}}
								>
									Event passed!
								</p>
							) : (
								<div
									style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
								>
									<div
										style={{
											flex: 1,
											textAlign: "center",
											background: "rgba(255,255,255,0.05)",
											borderRadius: 8,
											padding: "0.75rem",
										}}
									>
										<p
											style={{
												margin: 0,
												fontSize: "1.5rem",
												fontWeight: "bold",
												color: c.color,
											}}
										>
											{remaining.days}
										</p>
										<p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.5 }}>
											days
										</p>
									</div>
									<div
										style={{
											flex: 1,
											textAlign: "center",
											background: "rgba(255,255,255,0.05)",
											borderRadius: 8,
											padding: "0.75rem",
										}}
									>
										<p
											style={{
												margin: 0,
												fontSize: "1.5rem",
												fontWeight: "bold",
												color: c.color,
											}}
										>
											{remaining.hours}
										</p>
										<p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.5 }}>
											hrs
										</p>
									</div>
									<div
										style={{
											flex: 1,
											textAlign: "center",
											background: "rgba(255,255,255,0.05)",
											borderRadius: 8,
											padding: "0.75rem",
										}}
									>
										<p
											style={{
												margin: 0,
												fontSize: "1.5rem",
												fontWeight: "bold",
												color: c.color,
											}}
										>
											{remaining.minutes}
										</p>
										<p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.5 }}>
											min
										</p>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
