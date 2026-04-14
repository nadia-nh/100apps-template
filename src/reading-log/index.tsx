import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Book {
	id: string;
	title: string;
	author: string;
	status: "reading" | "toread" | "finished";
	startDate?: string;
	finishDate?: string;
	currentPage?: number;
	totalPages?: number;
	rating?: number;
}

export default function ReadingLog() {
	const [books, setBooks] = useState<Book[]>(() => {
		const saved = localStorage.getItem("reading-log");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAddBook, setShowAddBook] = useState(false);
	const [newBook, setNewBook] = useState({
		title: "",
		author: "",
		totalPages: 0,
		status: "toread" as Book["status"],
	});
	const [filter, setFilter] = useState<Book["status"] | "all">("all");

	useEffect(() => {
		localStorage.setItem("reading-log", JSON.stringify(books));
	}, [books]);

	const addBook = () => {
		if (!newBook.title.trim()) return;

		const book: Book = {
			id: Date.now().toString(),
			title: newBook.title.trim(),
			author: newBook.author.trim() || "Unknown",
			status: newBook.status,
			totalPages: newBook.totalPages || undefined,
			startDate:
				newBook.status === "reading"
					? new Date().toISOString().split("T")[0]
					: undefined,
		};

		setBooks([...books, book]);
		setNewBook({ title: "", author: "", totalPages: 0, status: "toread" });
		setShowAddBook(false);
	};

	const updateStatus = (id: string, status: Book["status"]) => {
		const today = new Date().toISOString().split("T")[0];
		setBooks(
			books.map((b) => {
				if (b.id !== id) return b;
				const updates: Partial<Book> = { status };
				if (status === "reading" && !b.startDate) updates.startDate = today;
				if (status === "finished" && !b.finishDate) updates.finishDate = today;
				if (status === "toread") {
					updates.startDate = undefined;
					updates.finishDate = undefined;
					updates.currentPage = undefined;
				}
				return { ...b, ...updates };
			}),
		);
	};

	const updateProgress = (id: string, page: number) => {
		setBooks(books.map((b) => (b.id === id ? { ...b, currentPage: page } : b)));
	};

	const rateBook = (id: string, rating: number) => {
		setBooks(books.map((b) => (b.id === id ? { ...b, rating } : b)));
	};

	const deleteBook = (id: string) => {
		setBooks(books.filter((b) => b.id !== id));
	};

	const filteredBooks =
		filter === "all" ? books : books.filter((b) => b.status === filter);

	const currentlyReading = books.filter((b) => b.status === "reading");
	const finishedBooks = books.filter((b) => b.status === "finished");

	const avgRating = finishedBooks
		.filter((b) => b.rating)
		.reduce((sum, b, _, arr) => sum + (b.rating || 0) / arr.length, 0);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Reading Log</h1>
				<p>Track your literary journey</p>
			</div>

			<div className="stats-row">
				<div className="stat-card">
					<span className="stat-num">{books.length}</span>
					<span className="stat-label">Books</span>
				</div>
				<div className="stat-card">
					<span className="stat-num">{currentlyReading.length}</span>
					<span className="stat-label">Reading</span>
				</div>
				<div className="stat-card">
					<span className="stat-num">{finishedBooks.length}</span>
					<span className="stat-label">Finished</span>
				</div>
				<div className="stat-card">
					<span className="stat-num">{avgRating.toFixed(1)}</span>
					<span className="stat-label">Avg Rating</span>
				</div>
			</div>

			<div className="filter-tabs">
				{(["all", "reading", "toread", "finished"] as const).map((f) => (
					<button
						key={f}
						className={filter === f ? "active" : ""}
						onClick={() => setFilter(f)}
					>
						{f === "all"
							? "All"
							: f === "toread"
								? "To Read"
								: f.charAt(0).toUpperCase() + f.slice(1)}
					</button>
				))}
			</div>

			<div className="books-list">
				{filteredBooks.map((book) => (
					<div key={book.id} className="book-card">
						<div className="book-cover">
							<span className="book-icon">📖</span>
						</div>
						<div className="book-info">
							<h3>{book.title}</h3>
							<p className="author">{book.author}</p>

							{book.status === "reading" && (
								<div className="progress-section">
									<input
										type="range"
										min="0"
										max={book.totalPages || 100}
										value={book.currentPage || 0}
										onChange={(e) =>
											updateProgress(book.id, parseInt(e.target.value))
										}
									/>
									<span>
										{book.currentPage || 0} / {book.totalPages || "?"} pages
									</span>
								</div>
							)}

							{book.status === "finished" && (
								<div className="rating-section">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											className={`star ${book.rating && book.rating >= star ? "filled" : ""}`}
											onClick={() => rateBook(book.id, star)}
										>
											★
										</button>
									))}
								</div>
							)}

							<div className="book-actions">
								<select
									value={book.status}
									onChange={(e) =>
										updateStatus(book.id, e.target.value as Book["status"])
									}
								>
									<option value="toread">To Read</option>
									<option value="reading">Reading</option>
									<option value="finished">Finished</option>
								</select>
								<button
									className="delete-btn"
									onClick={() => deleteBook(book.id)}
								>
									×
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<button className="add-book-btn" onClick={() => setShowAddBook(true)}>
				+ Add Book
			</button>

			{showAddBook && (
				<div className="modal">
					<div className="modal-content">
						<button className="close" onClick={() => setShowAddBook(false)}>
							×
						</button>
						<h2>Add Book</h2>

						<div className="form-group">
							<label>Title</label>
							<input
								type="text"
								placeholder="Book title"
								value={newBook.title}
								onChange={(e) =>
									setNewBook({ ...newBook, title: e.target.value })
								}
							/>
						</div>

						<div className="form-group">
							<label>Author</label>
							<input
								type="text"
								placeholder="Author name"
								value={newBook.author}
								onChange={(e) =>
									setNewBook({ ...newBook, author: e.target.value })
								}
							/>
						</div>

						<div className="form-group">
							<label>Total Pages</label>
							<input
								type="number"
								placeholder="0"
								value={newBook.totalPages || ""}
								onChange={(e) =>
									setNewBook({
										...newBook,
										totalPages: parseInt(e.target.value) || 0,
									})
								}
							/>
						</div>

						<div className="form-group">
							<label>Status</label>
							<select
								value={newBook.status}
								onChange={(e) =>
									setNewBook({
										...newBook,
										status: e.target.value as Book["status"],
									})
								}
							>
								<option value="toread">To Read</option>
								<option value="reading">Currently Reading</option>
								<option value="finished">Finished</option>
							</select>
						</div>

						<button className="save-btn" onClick={addBook}>
							Add Book
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #faf8f5;
          color: #2c2a26;
          padding: 1.5rem;
          font-family: 'Lora', Georgia, serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(44, 42, 38, 0.5);
          text-decoration: none;
          font-size: 0.85rem;
          font-family: system-ui, sans-serif;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 500;
          margin: 0;
          font-style: italic;
        }

        .header p {
          color: rgba(44, 42, 38, 0.5);
          font-size: 0.9rem;
          margin-top: 0.25rem;
          font-family: system-ui, sans-serif;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }

        .stat-num {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #8b5a2b;
          font-family: system-ui, sans-serif;
        }

        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(44, 42, 38, 0.4);
          font-family: system-ui, sans-serif;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .filter-tabs button {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(44, 42, 38, 0.1);
          border-radius: 1.5rem;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          font-family: system-ui, sans-serif;
          transition: all 0.2s;
        }

        .filter-tabs button.active {
          background: #8b5a2b;
          color: white;
          border-color: #8b5a2b;
        }

        .books-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .book-card {
          display: flex;
          gap: 1rem;
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }

        .book-cover {
          width: 60px;
          height: 80px;
          background: linear-gradient(135deg, #8b5a2b, #654321);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .book-icon {
          font-size: 1.5rem;
        }

        .book-info {
          flex: 1;
          min-width: 0;
        }

        .book-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .author {
          margin: 0.25rem 0 0.5rem;
          font-size: 0.85rem;
          color: rgba(44, 42, 38, 0.6);
          font-style: italic;
        }

        .progress-section {
          margin-bottom: 0.5rem;
        }

        .progress-section input {
          width: 100%;
          margin-bottom: 0.25rem;
          accent-color: #8b5a2b;
        }

        .progress-section span {
          font-size: 0.75rem;
          color: rgba(44, 42, 38, 0.5);
          font-family: system-ui, sans-serif;
        }

        .rating-section {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .star {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #ddd;
          cursor: pointer;
          padding: 0;
        }

        .star.filled {
          color: #f5c518;
        }

        .book-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .book-actions select {
          flex: 1;
          padding: 0.4rem 0.75rem;
          border: 1px solid rgba(44, 42, 38, 0.1);
          border-radius: 0.5rem;
          font-size: 0.8rem;
          background: white;
          font-family: system-ui, sans-serif;
        }

        .delete-btn {
          background: none;
          border: none;
          color: rgba(44, 42, 38, 0.3);
          font-size: 1.25rem;
          cursor: pointer;
        }

        .delete-btn:hover {
          color: #dc2626;
        }

        .add-book-btn {
          width: 100%;
          padding: 1rem;
          background: #8b5a2b;
          color: white;
          border: none;
          border-radius: 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-book-btn:hover {
          background: #704620;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          background: white;
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
          font-size: 1.5rem;
          cursor: pointer;
          color: rgba(44, 42, 38, 0.5);
        }

        .modal-content h2 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.8rem;
          color: rgba(44, 42, 38, 0.5);
          margin-bottom: 0.5rem;
          font-family: system-ui, sans-serif;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          background: #faf8f5;
          border: 1px solid rgba(44, 42, 38, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          box-sizing: border-box;
          font-family: system-ui, sans-serif;
        }

        .save-btn {
          width: 100%;
          padding: 0.85rem;
          background: #8b5a2b;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
        }
      `}</style>
		</div>
	);
}
