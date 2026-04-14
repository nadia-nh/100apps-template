import { useState } from "react";
import { Link } from "react-router-dom";

interface Poll {
	id: number;
	question: string;
	options: { text: string; votes: number }[];
	type: "yesno" | "multiple" | "scale";
}

export default function QuickPoll() {
	const [polls, setPolls] = useState<Poll[]>([]);
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState("Yes,No");
	const [pollType, setPollType] = useState<"yesno" | "multiple" | "scale">(
		"yesno",
	);
	const [showCreate, setShowCreate] = useState(true);

	const createPoll = () => {
		if (!question.trim()) return;
		let opts: { text: string; votes: number }[] = [];
		if (pollType === "yesno") {
			opts = [
				{ text: "Yes", votes: 0 },
				{ text: "No", votes: 0 },
			];
		} else if (pollType === "scale") {
			opts = Array.from({ length: 10 }, (_, i) => ({
				text: String(i + 1),
				votes: 0,
			}));
		} else {
			opts = options
				.split(",")
				.map((o) => ({ text: o.trim(), votes: 0 }))
				.filter((o) => o.text);
		}
		setPolls([
			{ id: Date.now(), question, options: opts, type: pollType },
			...polls,
		]);
		setQuestion("");
		setShowCreate(false);
	};

	const vote = (pollId: number, optIndex: number) => {
		setPolls(
			polls.map((p) =>
				p.id === pollId
					? {
							...p,
							options: p.options.map((o, i) =>
								i === optIndex ? { ...o, votes: o.votes + 1 } : o,
							),
						}
					: p,
			),
		);
	};

	const totalVotes = (poll: Poll) =>
		poll.options.reduce((a, b) => a + b.votes, 0);

	const getShareText = (poll: Poll) => {
		const lines = [
			poll.question,
			...poll.options.map((o) => `${o.text}: ${o.votes}`),
		];
		return encodeURIComponent(lines.join("\n"));
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e1e2e",
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
					Quick Poll
				</h1>

				{showCreate && (
					<div
						style={{
							background: "#313244",
							borderRadius: 16,
							padding: "1.5rem",
							marginBottom: "1.5rem",
						}}
					>
						<input
							type="text"
							placeholder="Your question?"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#1e1e2e",
								color: "white",
								marginBottom: "0.75rem",
								fontSize: "1rem",
							}}
						/>

						<div
							style={{
								display: "flex",
								gap: "0.5rem",
								marginBottom: "0.75rem",
							}}
						>
							{(["yesno", "multiple", "scale"] as const).map((t) => (
								<button
									key={t}
									onClick={() => setPollType(t)}
									style={{
										flex: 1,
										padding: "0.5rem",
										borderRadius: 6,
										border: "none",
										background:
											pollType === t ? "#cba6f7" : "rgba(255,255,255,0.1)",
										color: pollType === t ? "#1e1e2e" : "white",
										cursor: "pointer",
										textTransform: "capitalize",
										fontSize: "0.85rem",
									}}
								>
									{t === "yesno" ? "Yes/No" : t}
								</button>
							))}
						</div>

						{pollType === "multiple" && (
							<input
								type="text"
								placeholder="Options (comma separated)"
								value={options}
								onChange={(e) => setOptions(e.target.value)}
								style={{
									width: "100%",
									padding: "0.75rem",
									borderRadius: 8,
									border: "none",
									background: "#1e1e2e",
									color: "white",
									marginBottom: "0.75rem",
								}}
							/>
						)}

						<button
							onClick={createPoll}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#cba6f7",
								color: "#1e1e2e",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Create Poll
						</button>
					</div>
				)}

				{!showCreate && (
					<button
						onClick={() => setShowCreate(true)}
						style={{
							marginBottom: "1.5rem",
							padding: "0.75rem",
							borderRadius: 8,
							border: "1px solid rgba(255,255,255,0.2)",
							background: "transparent",
							color: "white",
							cursor: "pointer",
							width: "100%",
						}}
					>
						+ New Poll
					</button>
				)}

				{polls.map((poll) => (
					<div
						key={poll.id}
						style={{
							background: "#313244",
							borderRadius: 16,
							padding: "1.5rem",
							marginBottom: "1rem",
						}}
					>
						<h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem" }}>
							{poll.question}
						</h3>

						{poll.options.map((opt, i) => {
							const pct = totalVotes(poll)
								? Math.round((opt.votes / totalVotes(poll)) * 100)
								: 0;
							return (
								<button
									key={i}
									onClick={() => vote(poll.id, i)}
									style={{
										width: "100%",
										padding: "0.75rem",
										borderRadius: 8,
										border: "none",
										background: "rgba(255,255,255,0.05)",
										color: "white",
										cursor: "pointer",
										marginBottom: "0.5rem",
										textAlign: "left",
										position: "relative",
										overflow: "hidden",
									}}
								>
									<div
										style={{
											position: "absolute",
											left: 0,
											top: 0,
											bottom: 0,
											width: `${pct}%`,
											background: "rgba(203,166,247,0.3)",
											transition: "width 0.3s",
										}}
									/>
									<span
										style={{
											position: "relative",
											zIndex: 1,
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<span>{opt.text}</span>
										<span>
											{opt.votes} ({pct}%)
										</span>
									</span>
								</button>
							);
						})}

						<p
							style={{
								margin: "0.75rem 0 0",
								fontSize: "0.8rem",
								opacity: 0.5,
							}}
						>
							{totalVotes(poll)} votes
						</p>

						<a
							href={`mailto:?subject=${encodeURIComponent(poll.question)}&body=${getShareText(poll)}`}
							style={{
								display: "inline-block",
								marginTop: "0.75rem",
								fontSize: "0.8rem",
								color: "#cba6f7",
								textDecoration: "none",
							}}
						>
							Share Results →
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
