import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Coin {
	symbol: string;
	name: string;
}

const popularCoins: Coin[] = [
	{ symbol: "BTC", name: "Bitcoin" },
	{ symbol: "ETH", name: "Ethereum" },
	{ symbol: "SOL", name: "Solana" },
	{ symbol: "XRP", name: "Ripple" },
	{ symbol: "ADA", name: "Cardano" },
	{ symbol: "DOGE", name: "Dogecoin" },
	{ symbol: "DOT", name: "Polkadot" },
	{ symbol: "MATIC", name: "Polygon" },
];

const fakePrices: Record<string, number> = {
	BTC: 67450,
	ETH: 3520,
	SOL: 145,
	XRP: 0.62,
	ADA: 0.45,
	DOGE: 0.12,
	DOT: 7.2,
	MATIC: 0.58,
};

export default function CryptoWatch() {
	const [favorites, setFavorites] = useState<string[]>(() => {
		const saved = localStorage.getItem("crypto-favs");
		return saved ? JSON.parse(saved) : ["BTC", "ETH", "SOL"];
	});
	const [prices, setPrices] = useState<Record<string, number>>({});
	const [lastUpdated, setLastUpdated] = useState<string | null>(null);

	const updatePrices = () => {
		const newPrices: Record<string, number> = {};
		favorites.forEach((sym) => {
			const base = fakePrices[sym] || 100;
			newPrices[sym] = base * (0.98 + Math.random() * 0.04);
		});
		setPrices(newPrices);
		setLastUpdated(new Date().toLocaleTimeString());
	};

	useEffect(() => {
		localStorage.setItem("crypto-favs", JSON.stringify(favorites));
	}, [favorites]);
	useEffect(() => {
		updatePrices();
	}, [favorites]);

	const toggleFavorite = (symbol: string) => {
		setFavorites(
			favorites.includes(symbol)
				? favorites.filter((f) => f !== symbol)
				: [...favorites, symbol],
		);
	};

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
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "1rem",
					}}
				>
					<h1 style={{ fontSize: "1.8rem", margin: 0 }}>Crypto Watch</h1>
					<button
						onClick={updatePrices}
						style={{
							padding: "0.5rem 1rem",
							borderRadius: 8,
							border: "none",
							background: "#3b82f6",
							color: "white",
							cursor: "pointer",
						}}
					>
						↻ Refresh
					</button>
				</div>
				<p style={{ opacity: 0.5, marginBottom: "2rem" }}>
					Manual price tracker {lastUpdated && `· ${lastUpdated}`}
				</p>

				{favorites.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3 }}>
						Add coins to watchlist
					</p>
				)}

				{favorites.map((sym) => {
					const coin = popularCoins.find((c) => c.symbol === sym) || {
						symbol: sym,
						name: sym,
					};
					const price = prices[sym] || fakePrices[sym] || 0;
					const change = (Math.random() - 0.5) * 4;
					return (
						<div
							key={sym}
							style={{
								background: "#1e293b",
								borderRadius: 12,
								padding: "1rem",
								marginBottom: "0.75rem",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div>
								<p
									style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}
								>
									{coin.name}
								</p>
								<p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
									{coin.symbol}
								</p>
							</div>
							<div style={{ textAlign: "right" }}>
								<p
									style={{ margin: 0, fontWeight: "bold", fontSize: "1.2rem" }}
								>
									$
									{price.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "0.85rem",
										color: change >= 0 ? "#22c55e" : "#ef4444",
									}}
								>
									{change >= 0 ? "+" : ""}
									{change.toFixed(2)}%
								</p>
							</div>
						</div>
					);
				})}

				<h2
					style={{
						fontSize: "1.1rem",
						marginTop: "1.5rem",
						marginBottom: "1rem",
						opacity: 0.8,
					}}
				>
					Add Coins
				</h2>
				<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
					{popularCoins
						.filter((c) => !favorites.includes(c.symbol))
						.map((coin) => (
							<button
								key={coin.symbol}
								onClick={() => toggleFavorite(coin.symbol)}
								style={{
									padding: "0.5rem 0.75rem",
									borderRadius: 20,
									border: "1px solid #334155",
									background: "transparent",
									color: "white",
									cursor: "pointer",
									fontSize: "0.85rem",
								}}
							>
								+ {coin.symbol}
							</button>
						))}
				</div>
			</div>
		</div>
	);
}
