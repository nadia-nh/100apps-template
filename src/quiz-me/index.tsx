import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Question {
	id: number;
	question: string;
	options: string[];
	correct: number;
}

export default function QuizMe() {
	const [quizzes, setQuizzes] = useState<
		{ name: string; questions: Question[] }[]
	>(() => {
		const saved = localStorage.getItem("quizzes");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [quizName, setQuizName] = useState("");
	const [currentQuiz, setCurrentQuiz] = useState<{
		name: string;
		questions: Question[];
	} | null>(null);
	const [currentQ, setCurrentQ] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [score, setScore] = useState(0);

	const addQuiz = (quiz: { name: string; questions: Question[] }) => {
		setQuizzes([...quizzes, quiz]);
		setShowAdd(false);
		setQuizName("");
	};

	const startQuiz = (quiz: { name: string; questions: Question[] }) => {
		setCurrentQuiz(quiz);
		setCurrentQ(0);
		setShowAnswer(false);
		setScore(0);
	};

	const answer = (idx: number) => {
		if (!currentQuiz) return;
		if (idx === currentQuiz.questions[currentQ].correct) setScore((s) => s + 1);
		setShowAnswer(true);
	};

	const next = () => {
		if (!currentQuiz) return;
		if (currentQ < currentQuiz.questions.length - 1) {
			setCurrentQ((c) => c + 1);
			setShowAnswer(false);
		} else {
			setCurrentQuiz(null);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e293b",
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
					Quiz Me
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Self-quiz creator
				</p>

				{!currentQuiz ? (
					<>
						<button
							onClick={() => setShowAdd(!showAdd)}
							style={{
								width: "100%",
								padding: "1rem",
								borderRadius: 12,
								border: "none",
								background: "#3b82f6",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
								marginBottom: "1rem",
							}}
						>
							+ Create Quiz
						</button>

						{showAdd && (
							<QuizForm onAdd={addQuiz} name={quizName} setName={setQuizName} />
						)}

						{quizzes.length === 0 && (
							<p
								style={{
									textAlign: "center",
									opacity: 0.3,
									marginTop: "1.5rem",
								}}
							>
								No quizzes yet
							</p>
						)}

						{quizzes.map((quiz, i) => (
							<div
								key={i}
								style={{
									background: "#334155",
									borderRadius: 12,
									padding: "1rem",
									marginTop: "1rem",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<span style={{ fontWeight: "bold" }}>
									{quiz.name} ({quiz.questions.length} Qs)
								</span>
								<button
									onClick={() => startQuiz(quiz)}
									style={{
										padding: "0.5rem 1rem",
										borderRadius: 8,
										border: "none",
										background: "#22c55e",
										color: "white",
										cursor: "pointer",
									}}
								>
									Start
								</button>
							</div>
						))}
					</>
				) : (
					<div style={{ textAlign: "center" }}>
						<p style={{ opacity: 0.6 }}>
							Question {currentQ + 1} / {currentQuiz.questions.length}
						</p>
						<h2 style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
							{currentQuiz.questions[currentQ].question}
						</h2>
						{currentQuiz.questions[currentQ].options.map((opt, i) => (
							<button
								key={i}
								onClick={() => !showAnswer && answer(i)}
								disabled={showAnswer}
								style={{
									width: "100%",
									padding: "1rem",
									borderRadius: 12,
									border: "none",
									background: showAnswer
										? i === currentQuiz.questions[currentQ].correct
											? "#22c55e"
											: i === currentQuiz.questions[currentQ].correct
												? "#22c55e"
												: "#334155"
										: "#334155",
									color: "white",
									cursor: showAnswer ? "default" : "pointer",
									marginBottom: "0.5rem",
									textAlign: "left",
								}}
							>
								{opt}
							</button>
						))}
						{showAnswer && (
							<button
								onClick={next}
								style={{
									marginTop: "1rem",
									padding: "1rem 2rem",
									borderRadius: 12,
									border: "none",
									background: "#3b82f6",
									color: "white",
									fontWeight: "bold",
									cursor: "pointer",
								}}
							>
								{currentQ < currentQuiz.questions.length - 1
									? "Next"
									: "Finish"}
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function QuizForm({
	onAdd,
	name,
	setName,
}: {
	onAdd: (q: { name: string; questions: Question[] }) => void;
	name: string;
	setName: (s: string) => void;
}) {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [q, setQ] = useState({
		question: "",
		options: ["", "", "", ""],
		correct: 0,
	});

	const addQuestion = () => {
		if (!q.question) return;
		setQuestions([...questions, { id: Date.now(), ...q }]);
		setQ({ question: "", options: ["", "", "", ""], correct: 0 });
	};
	const create = () => {
		if (name && questions.length) {
			onAdd({ name, questions });
		}
	};

	return (
		<div
			style={{
				background: "#334155",
				borderRadius: 12,
				padding: "1rem",
				marginBottom: "1rem",
			}}
		>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Quiz name"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#1e293b",
					color: "white",
					marginBottom: "0.75rem",
				}}
			/>
			<input
				type="text"
				value={q.question}
				onChange={(e) => setQ({ ...q, question: e.target.value })}
				placeholder="Question"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#1e293b",
					color: "white",
					marginBottom: "0.5rem",
				}}
			/>
			{q.options.map((opt, i) => (
				<input
					key={i}
					type="text"
					value={opt}
					onChange={(e) =>
						setQ({
							...q,
							options: q.options.map((o, j) => (j === i ? e.target.value : o)),
						})
					}
					placeholder={`Option ${i + 1}`}
					style={{
						width: "100%",
						padding: "0.5rem",
						borderRadius: 6,
						border: "1px solid #3b82f6",
						background: "#1e293b",
						color: "white",
						marginBottom: "0.25rem",
					}}
				/>
			))}
			<button
				onClick={addQuestion}
				style={{
					marginTop: "0.5rem",
					width: "100%",
					padding: "0.5rem",
					borderRadius: 6,
					border: "none",
					background: "#3b82f6",
					color: "white",
					cursor: "pointer",
				}}
			>
				Add Question
			</button>
			<p style={{ margin: "0.5rem 0", opacity: 0.6, fontSize: "0.85rem" }}>
				{questions.length} questions added
			</p>
			<button
				onClick={create}
				disabled={!name || !questions.length}
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: name && questions.length ? "#22c55e" : "#666",
					color: "white",
					fontWeight: "bold",
					cursor: name && questions.length ? "pointer" : "not-allowed",
				}}
			>
				Create Quiz
			</button>
		</div>
	);
}
