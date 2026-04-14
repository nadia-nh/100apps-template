import { useState } from "react";
import { Link } from "react-router-dom";

type UuidFormat = "uuid4" | "short" | "nanoid";

export default function UuidGen() {
	const [history, setHistory] = useState<
		{ value: string; format: UuidFormat; time: string }[]
	>([]);
	const [copied, setCopied] = useState<string | null>(null);
	const [format, setFormat] = useState<UuidFormat>("uuid4");

	const generateId = () => {
		let value: string;
		switch (format) {
			case "uuid4":
				value = crypto.randomUUID();
				break;
			case "short":
				value = Array.from(crypto.getRandomValues(new Uint8Array(4)))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");
				break;
			case "nanoid": {
				const chars =
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				value = Array.from(crypto.getRandomValues(new Uint8Array(8)))
					.map((b) => chars[b % chars.length])
					.join("");
				break;
			}
		}

		const time = new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
		setHistory([{ value, format, time }, ...history.slice(0, 19)]);
		return value;
	};

	const copyToClipboard = async (value: string) => {
		await navigator.clipboard.writeText(value);
		setCopied(value);
		setTimeout(() => setCopied(null), 2000);
	};

	const generateAndCopy = async () => {
		const id = generateId();
		await copyToClipboard(id);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>UUID Gen</h1>
				<p>Developer identity tools</p>
			</div>

			<div className="format-selector">
				{(
					[
						{ value: "uuid4", label: "UUID v4", desc: "Standard 36-char UUID" },
						{ value: "short", label: "Short ID", desc: "8-char hex string" },
						{ value: "nanoid", label: "Nanoid", desc: "8-char alphanumeric" },
					] as const
				).map((f) => (
					<button
						key={f.value}
						className={`format-btn ${format === f.value ? "active" : ""}`}
						onClick={() => setFormat(f.value)}
					>
						<span className="format-label">{f.label}</span>
						<span className="format-desc">{f.desc}</span>
					</button>
				))}
			</div>

			<button className="generate-btn" onClick={generateAndCopy}>
				{copied ? "✓ Copied!" : "Generate & Copy"}
			</button>

			<button className="generate-only-btn" onClick={() => generateId()}>
				Generate Only
			</button>

			{history.length > 0 && (
				<div className="history-section">
					<h3>Recent</h3>
					<div className="history-list">
						{history.map((item, i) => (
							<div key={i} className="history-item">
								<code className="id-value">{item.value}</code>
								<div className="history-actions">
									<span className="history-format">{item.format}</span>
									<button
										className={`copy-btn ${copied === item.value ? "copied" : ""}`}
										onClick={() => copyToClipboard(item.value)}
									>
										{copied === item.value ? "✓" : "Copy"}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="info-section">
				<h3>About</h3>
				<div className="info-cards">
					<div className="info-card">
						<span className="info-icon">🔒</span>
						<div>
							<h4>Secure</h4>
							<p>
								Uses crypto.getRandomValues() for cryptographically secure
								randomness
							</p>
						</div>
					</div>
					<div className="info-card">
						<span className="info-icon">⚡</span>
						<div>
							<h4>Fast</h4>
							<p>Client-side generation with zero latency</p>
						</div>
					</div>
					<div className="info-card">
						<span className="info-icon">📋</span>
						<div>
							<h4>Clipboard</h4>
							<p>One-click copy to clipboard</p>
						</div>
					</div>
				</div>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #0d0d0d;
          color: #e0e0e0;
          padding: 1.5rem;
          font-family: 'IBM Plex Mono', monospace;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.85rem;
          font-family: system-ui, sans-serif;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: -1px;
        }

        .header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          margin-top: 0.25rem;
          font-family: system-ui, sans-serif;
        }

        .format-selector {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .format-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .format-btn:hover {
          background: rgba(255,255,255,0.06);
        }

        .format-btn.active {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .format-label {
          color: #fff;
          font-weight: 500;
        }

        .format-desc {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
        }

        .generate-btn {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: none;
          border-radius: 1rem;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 0.75rem;
          transition: all 0.2s;
          font-family: inherit;
        }

        .generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .generate-only-btn {
          width: 100%;
          padding: 0.85rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .generate-only-btn:hover {
          background: rgba(255,255,255,0.08);
        }

        .history-section {
          margin-top: 2rem;
        }

        .history-section h3 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
          margin: 0 0 0.75rem;
          font-family: system-ui, sans-serif;
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
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.5rem;
        }

        .id-value {
          font-size: 0.85rem;
          color: #3b82f6;
          word-break: break-all;
        }

        .history-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          margin-left: 1rem;
        }

        .history-format {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 0.2rem 0.5rem;
          background: rgba(255,255,255,0.05);
          border-radius: 0.25rem;
        }

        .copy-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 0.3rem 0.6rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .copy-btn.copied {
          background: #22c55e;
          color: white;
        }

        .info-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .info-section h3 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
          margin: 0 0 0.75rem;
          font-family: system-ui, sans-serif;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-card {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: 0.5rem;
        }

        .info-icon {
          font-size: 1.25rem;
        }

        .info-card h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .info-card p {
          margin: 0.25rem 0 0;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          font-family: system-ui, sans-serif;
        }
      `}</style>
		</div>
	);
}
