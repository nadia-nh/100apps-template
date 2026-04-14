import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface BatteryEntry {
	timestamp: string;
	level: number;
	activity: string;
}

export default function SocialBattery() {
	const [entries, setEntries] = useState<BatteryEntry[]>(() => {
		const saved = localStorage.getItem("social-battery");
		return saved ? JSON.parse(saved) : [];
	});
	const [level, setLevel] = useState(5);
	const [activity, setActivity] = useState("");

	useEffect(() => {
		localStorage.setItem("social-battery", JSON.stringify(entries));
	}, [entries]);

	const logBattery = () => {
		setEntries([
			...entries,
			{ timestamp: new Date().toISOString(), level, activity },
		]);
		setActivity("");
	};

	const getBatteryColor = (l: number) => {
		if (l >= 8) return "#22c55e";
		if (l >= 5) return "#eab308";
		return "#ef4444";
	};

	const today = new Date().toISOString().split("T")[0];
	const todayEntries = entries.filter((e) => e.timestamp.startsWith(today));
	const latestLevel = todayEntries[0]?.level;

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1f1f1f",
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
					Social Battery
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track your social energy
				</p>

				<div
					style={{
						background: "#2a2a2a",
						borderRadius: 24,
						padding: "2rem",
						textAlign: "center",
						marginBottom: "1.5rem",
					}}
				>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "0.5rem",
							padding: "0.5rem 1rem",
							background: "rgba(255,255,255,0.1)",
							borderRadius: 20,
							marginBottom: "1rem",
						}}
					>
						<span style={{ fontSize: "2rem" }}>🔋</span>
						<span
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								color: getBatteryColor(level),
							}}
						>
							{level}
						</span>
						<span style={{ opacity: 0.6 }}>/10</span>
					</div>
					<input
						type="range"
						min="1"
						max="10"
						value={level}
						onChange={(e) => setLevel(Number(e.target.value))}
						style={{
							width: "100%",
							accentColor: getBatteryColor(level),
							marginBottom: "1rem",
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							fontSize: "0.8rem",
							opacity: 0.5,
							marginBottom: "1rem",
						}}
					>
						<span>Drained</span>
						<span>Charged</span>
					</div>
					<input
						type="text"
						placeholder="What are you doing?"
						value={activity}
						onChange={(e) => setActivity(e.target.value)}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#1f1f1f",
							color: "white",
							marginBottom: "0.75rem",
						}}
					/>
					<button
						onClick={logBattery}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: getBatteryColor(level),
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Log
					</button>
				</div>

				{latestLevel && (
					<div
						style={{
							background: "#2a2a2a",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
							textAlign: "center",
						}}
					>
						<p style={{ margin: 0, opacity: 0.6, fontSize: "0.9rem" }}>
							Current Level
						</p>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "0.5rem",
								marginTop: "0.5rem",
							}}
						>
							<div
								style={{
									width: 100,
									height: 12,
									background: "#1f1f1f",
									borderRadius: 6,
									overflow: "hidden",
								}}
							>
								<div
									style={{
										width: `${latestLevel * 10}%`,
										height: "100%",
										background: getBatteryColor(latestLevel),
										transition: "width 0.3s",
									}}
								/>
							</div>
							<span
								style={{
									fontWeight: "bold",
									color: getBatteryColor(latestLevel),
								}}
							>
								{latestLevel}
							</span>
						</div>
					</div>
				)}

				<h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.8 }}>
					Today's Log
				</h2>
				{todayEntries.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>No entries today</p>
				)}

				{todayEntries.slice(0, 8).map((e, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "0.75rem",
							background: "#2a2a2a",
							borderRadius: 8,
							marginBottom: "0.5rem",
						}}
					>
						<div>
							<p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.6 }}>
								{new Date(e.timestamp).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
							{e.activity && (
								<p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
									{e.activity}
								</p>
							)}
						</div>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<div
								style={{
									width: 40,
									height: 6,
									background: "#1f1f1f",
									borderRadius: 3,
									overflow: "hidden",
								}}
							>
								<div
									style={{
										width: `${e.level * 10}%`,
										height: "100%",
										background: getBatteryColor(e.level),
									}}
								/>
							</div>
							<span
								style={{ fontWeight: "bold", color: getBatteryColor(e.level) }}
							>
								{e.level}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
