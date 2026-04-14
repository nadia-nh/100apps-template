import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Chore {
	id: string;
	name: string;
}

interface Member {
	id: string;
	name: string;
}

interface Assignment {
	choreId: string;
	memberId: string;
	weekStart: string;
}

export default function ChoreRotate() {
	const [chores, setChores] = useState<Chore[]>(() => {
		const saved = localStorage.getItem("chore-chores");
		return saved
			? JSON.parse(saved)
			: [
					{ id: "1", name: "Dishes" },
					{ id: "2", name: "Vacuum" },
					{ id: "3", name: "Bathroom" },
					{ id: "4", name: "Trash" },
				];
	});

	const [members, setMembers] = useState<Member[]>(() => {
		const saved = localStorage.getItem("chore-members");
		return saved
			? JSON.parse(saved)
			: [
					{ id: "1", name: "Alex" },
					{ id: "2", name: "Sam" },
				];
	});

	const [assignments, setAssignments] = useState<Assignment[]>(() => {
		const saved = localStorage.getItem("chore-assignments");
		return saved ? JSON.parse(saved) : [];
	});

	const [newChore, setNewChore] = useState("");
	const [newMember, setNewMember] = useState("");

	useEffect(() => {
		localStorage.setItem("chore-chores", JSON.stringify(chores));
		localStorage.setItem("chore-members", JSON.stringify(members));
		localStorage.setItem("chore-assignments", JSON.stringify(assignments));
	}, [chores, members, assignments]);

	const getWeekStart = (date: Date = new Date()) => {
		const d = new Date(date);
		const day = d.getDay();
		d.setDate(d.getDate() - day);
		return d.toISOString().split("T")[0];
	};

	const currentWeek = getWeekStart();

	const getCurrentAssignments = () => {
		return chores.map((chore) => {
			const assignment = assignments.find(
				(a) => a.choreId === chore.id && a.weekStart === currentWeek,
			);
			return {
				chore,
				member: assignment
					? members.find((m) => m.id === assignment.memberId)
					: null,
			};
		});
	};

	const rotate = () => {
		const newAssignments: Assignment[] = [];

		chores.forEach((chore, index) => {
			const currentAssignment = assignments.find(
				(a) => a.choreId === chore.id && a.weekStart === currentWeek,
			);

			const currentIndex = currentAssignment
				? members.findIndex((m) => m.id === currentAssignment.memberId)
				: index % members.length;

			const nextIndex = (currentIndex + 1) % members.length;

			newAssignments.push({
				choreId: chore.id,
				memberId: members[nextIndex].id,
				weekStart: currentWeek,
			});
		});

		setAssignments([
			...assignments.filter((a) => a.weekStart !== currentWeek),
			...newAssignments,
		]);
	};

	const assignMember = (choreId: string, memberId: string) => {
		const existing = assignments.findIndex(
			(a) => a.choreId === choreId && a.weekStart === currentWeek,
		);

		if (existing >= 0) {
			const newAssignments = [...assignments];
			newAssignments[existing] = { choreId, memberId, weekStart: currentWeek };
			setAssignments(newAssignments);
		} else {
			setAssignments([
				...assignments,
				{ choreId, memberId, weekStart: currentWeek },
			]);
		}
	};

	const addChore = () => {
		if (newChore.trim()) {
			setChores([
				...chores,
				{ id: Date.now().toString(), name: newChore.trim() },
			]);
			setNewChore("");
		}
	};

	const addMember = () => {
		if (newMember.trim()) {
			setMembers([
				...members,
				{ id: Date.now().toString(), name: newMember.trim() },
			]);
			setNewMember("");
		}
	};

	const removeChore = (id: string) => {
		setChores(chores.filter((c) => c.id !== id));
	};

	const removeMember = (id: string) => {
		setMembers(members.filter((m) => m.id !== id));
	};

	const currentAssignments = getCurrentAssignments();
	const completedCount = currentAssignments.filter((a) => a.member).length;

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Chore Rotate</h1>
				<p>
					Week of{" "}
					{new Date(currentWeek).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					})}
				</p>
			</div>

			<div className="week-progress">
				<div className="progress-bar">
					<div
						className="progress-fill"
						style={{ width: `${(completedCount / chores.length) * 100}%` }}
					/>
				</div>
				<span className="progress-text">
					{completedCount}/{chores.length} assigned
				</span>
			</div>

			<div className="assignments">
				{currentAssignments.map(({ chore, member }) => (
					<div key={chore.id} className="assignment-card">
						<span className="chore-name">{chore.name}</span>
						<select
							value={member?.id || ""}
							onChange={(e) => assignMember(chore.id, e.target.value)}
						>
							<option value="">Unassigned</option>
							{members.map((m) => (
								<option key={m.id} value={m.id}>
									{m.name}
								</option>
							))}
						</select>
					</div>
				))}
			</div>

			<button className="rotate-btn" onClick={rotate}>
				<span>🔄</span> Rotate Assignments
			</button>

			<div className="manage-section">
				<div className="manage-col">
					<h3>Chores</h3>
					<div className="items-list">
						{chores.map((chore) => (
							<div key={chore.id} className="item-row">
								<span>{chore.name}</span>
								<button onClick={() => removeChore(chore.id)}>×</button>
							</div>
						))}
					</div>
					<div className="add-row">
						<input
							type="text"
							placeholder="Add chore..."
							value={newChore}
							onChange={(e) => setNewChore(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addChore()}
						/>
						<button onClick={addChore}>+</button>
					</div>
				</div>

				<div className="manage-col">
					<h3>Members</h3>
					<div className="items-list">
						{members.map((member) => (
							<div key={member.id} className="item-row">
								<span>{member.name}</span>
								<button onClick={() => removeMember(member.id)}>×</button>
							</div>
						))}
					</div>
					<div className="add-row">
						<input
							type="text"
							placeholder="Add member..."
							value={newMember}
							onChange={(e) => setNewMember(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addMember()}
						/>
						<button onClick={addMember}>+</button>
					</div>
				</div>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #1e1e24;
          color: #e8e8e8;
          padding: 1.5rem;
          font-family: 'Syne', system-ui, sans-serif;
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
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .week-progress {
          background: rgba(255,255,255,0.05);
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f093fb, #f5576c);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }

        .assignments {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .assignment-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.05);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
        }

        .chore-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .assignment-card select {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .rotate-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          border: none;
          border-radius: 1rem;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s;
        }

        .rotate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
        }

        .manage-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .manage-col {
          background: rgba(255,255,255,0.03);
          border-radius: 1rem;
          padding: 1rem;
        }

        .manage-col h3 {
          margin: 0 0 0.75rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border-radius: 0.5rem;
          font-size: 0.85rem;
        }

        .item-row button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 1rem;
          padding: 0 0.25rem;
        }

        .item-row button:hover {
          color: #f5576c;
        }

        .add-row {
          display: flex;
          gap: 0.5rem;
        }

        .add-row input {
          flex: 1;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.85rem;
        }

        .add-row input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .add-row button {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 0.5rem;
          color: white;
          width: 36px;
          cursor: pointer;
          font-size: 1rem;
        }
      `}</style>
		</div>
	);
}
