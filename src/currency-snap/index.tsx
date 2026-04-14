import { useState } from "react";
import { Link } from "react-router-dom";

interface Rate {
	code: string;
	name: string;
	rate: number;
}

const currencies: Omit<Rate, "rate">[] = [
	{ code: "USD", name: "US Dollar" },
	{ code: "EUR", name: "Euro" },
	{ code: "GBP", name: "British Pound" },
	{ code: "JPY", name: "Japanese Yen" },
	{ code: "CAD", name: "Canadian Dollar" },
	{ code: "AUD", name: "Australian Dollar" },
	{ code: "CHF", name: "Swiss Franc" },
	{ code: "CNY", name: "Chinese Yuan" },
	{ code: "INR", name: "Indian Rupee" },
	{ code: "MXN", name: "Mexican Peso" },
	{ code: "BRL", name: "Brazilian Real" },
	{ code: "KRW", name: "South Korean Won" },
];

const fallbackRates: Record<string, number> = {
	USD: 1,
	EUR: 0.92,
	GBP: 0.79,
	JPY: 149.5,
	CAD: 1.36,
	AUD: 1.53,
	CHF: 0.88,
	CNY: 7.24,
	INR: 83.12,
	MXN: 17.15,
	BRL: 4.97,
	KRW: 1320,
};

export default function CurrencySnap() {
	const [amounts, setAmounts] = useState<Record<string, string>>({
		USD: "100",
	});
	const [baseCurrency, setBaseCurrency] = useState("USD");

	const convert = (amount: number, from: string, to: string): number => {
		const fromRate = fallbackRates[from] || 1;
		const toRate = fallbackRates[to] || 1;
		return (amount / fromRate) * toRate;
	};

	const handleAmountChange = (code: string, value: string) => {
		const numValue = parseFloat(value) || 0;
		if (code === baseCurrency) {
			const converted: Record<string, string> = {};
			currencies.forEach((c) => {
				if (c.code !== baseCurrency) {
					converted[c.code] = convert(numValue, baseCurrency, c.code).toFixed(
						2,
					);
				}
			});
			setAmounts({ [baseCurrency]: value, ...converted });
		} else {
			const baseValue = convert(numValue, code, baseCurrency);
			const converted: Record<string, string> = {};
			currencies.forEach((c) => {
				if (c.code !== code && c.code !== baseCurrency) {
					converted[c.code] = convert(baseValue, baseCurrency, c.code).toFixed(
						2,
					);
				}
			});
			setAmounts({
				[baseCurrency]: baseValue.toFixed(2),
				[code]: value,
				...converted,
			});
		}
	};

	const setAsBase = (code: string) => {
		const currentValue = parseFloat(amounts[code]) || 0;
		setBaseCurrency(code);
		const newAmounts: Record<string, string> = {
			[code]: currentValue.toString(),
		};
		currencies.forEach((c) => {
			if (c.code !== code) {
				newAmounts[c.code] = convert(currentValue, code, c.code).toFixed(2);
			}
		});
		setAmounts(newAmounts);
	};

	const swapCurrencies = (code1: string, code2: string) => {
		const val1 = parseFloat(amounts[code1]) || 0;
		const val2 = parseFloat(amounts[code2]) || 0;
		setBaseCurrency(code1);
		const newAmounts: Record<string, string> = {
			[code1]: val2.toString(),
			[code2]: val1.toString(),
		};
		currencies.forEach((c) => {
			if (c.code !== code1 && c.code !== code2) {
				newAmounts[c.code] = convert(val2, code1, c.code).toFixed(2);
			}
		});
		setAmounts(newAmounts);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Currency Snap</h1>
				<p>Quick currency converter</p>
			</div>
			<div className="info-banner">
				<span className="info-icon">ℹ️</span>
				<span className="info-text">Offline rates from market close</span>
			</div>
			<div className="currency-grid">
				{currencies.map((currency) => (
					<div
						key={currency.code}
						className={`currency-card ${baseCurrency === currency.code ? "base" : ""}`}
					>
						<div className="card-header">
							<span className="currency-code">{currency.code}</span>
							{baseCurrency !== currency.code && (
								<button
									className="set-base-btn"
									onClick={() => setAsBase(currency.code)}
								>
									Set as base
								</button>
							)}
						</div>
						<input
							type="number"
							className="amount-input"
							value={amounts[currency.code] || ""}
							onChange={(e) =>
								handleAmountChange(currency.code, e.target.value)
							}
							placeholder="0.00"
						/>
						<span className="currency-name">{currency.name}</span>
						{baseCurrency !== currency.code && (
							<button
								className="swap-btn"
								onClick={() => swapCurrencies(currency.code, baseCurrency)}
							>
								⇄ Swap
							</button>
						)}
					</div>
				))}
			</div>
			<div className="rate-reference">
				<h3>Reference Rates (1 USD =)</h3>
				<div className="rates-list">
					{Object.entries(fallbackRates)
						.filter(([code]) => code !== "USD")
						.map(([code, rate]) => (
							<span key={code} className="rate-item">
								${rate.toFixed(2)} {code}
							</span>
						))}
				</div>
			</div>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #16162a 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin-top: 1rem; margin-bottom: 1rem; }
        .header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.25rem; background: linear-gradient(90deg, #00b894, #00cec9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .info-banner { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem; margin-bottom: 1.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .currency-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
        .currency-card { background: rgba(255,255,255,0.04); border-radius: 1rem; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s; }
        .currency-card.base { border-color: #00cec9; background: rgba(0,206,201,0.08); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .currency-code { font-weight: 700; font-size: 1.1rem; }
        .set-base-btn { font-size: 0.65rem; padding: 0.25rem 0.5rem; background: rgba(0,206,201,0.2); border: none; border-radius: 0.25rem; color: #00cec9; cursor: pointer; }
        .amount-input { width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.15); color: white; font-size: 1.25rem; font-weight: 600; padding: 0.25rem 0; margin-bottom: 0.25rem; box-sizing: border-box; }
        .currency-name { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.4); }
        .swap-btn { width: 100%; margin-top: 0.5rem; padding: 0.4rem; background: rgba(255,255,255,0.05); border: none; border-radius: 0.4rem; color: rgba(255,255,255,0.6); font-size: 0.75rem; cursor: pointer; }
        .rate-reference { background: rgba(255,255,255,0.02); border-radius: 1rem; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); }
        .rate-reference h3 { margin: 0 0 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
        .rates-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .rate-item { padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.03); border-radius: 0.25rem; font-size: 0.8rem; color: rgba(255,255,255,0.7); }
      `}</style>
		</div>
	);
}
