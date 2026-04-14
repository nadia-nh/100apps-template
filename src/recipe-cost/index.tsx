import { useState } from "react";
import { Link } from "react-router-dom";

interface Ingredient {
	id: string;
	name: string;
	price: number;
	quantity: number;
	unit: string;
}

interface Recipe {
	id: string;
	name: string;
	ingredients: Ingredient[];
	servings: number;
}

const unitOptions = [
	"",
	"oz",
	"lb",
	"g",
	"kg",
	"ml",
	"L",
	"cup",
	"tbsp",
	"tsp",
	"each",
	"bunch",
	"can",
	"box",
];

export default function RecipeCost() {
	const [recipes, setRecipes] = useState<Recipe[]>(() => {
		const saved = localStorage.getItem("recipes");
		return saved ? JSON.parse(saved) : [];
	});
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [showCompare, setShowCompare] = useState(false);

	const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
	const [newIngredient, setNewIngredient] = useState({
		name: "",
		price: "",
		quantity: "",
		unit: "",
	});

	const saveToStorage = (data: Recipe[]) => {
		setRecipes(data);
		localStorage.setItem("recipes", JSON.stringify(data));
	};

	const calculateTotal = (ingredients: Ingredient[]) =>
		ingredients.reduce((sum, ing) => sum + ing.price, 0);

	const calculatePerServing = (ingredients: Ingredient[], servings: number) =>
		servings > 0 ? calculateTotal(ingredients) / servings : 0;

	const createNewRecipe = () => {
		const newRecipe: Recipe = {
			id: `recipe-${Date.now()}`,
			name: "New Recipe",
			ingredients: [],
			servings: 4,
		};
		saveToStorage([...recipes, newRecipe]);
		setEditingRecipe(newRecipe);
		setSelectedRecipe(newRecipe);
		setIsEditing(true);
	};

	const updateRecipe = (updated: Recipe) => {
		const newRecipes = recipes.map((r) => (r.id === updated.id ? updated : r));
		saveToStorage(newRecipes);
		setEditingRecipe(updated);
		if (selectedRecipe?.id === updated.id) {
			setSelectedRecipe(updated);
		}
	};

	const deleteRecipe = (id: string) => {
		const newRecipes = recipes.filter((r) => r.id !== id);
		saveToStorage(newRecipes);
		if (selectedRecipe?.id === id) {
			setSelectedRecipe(null);
			setIsEditing(false);
		}
	};

	const addIngredient = () => {
		if (!editingRecipe || !newIngredient.name || !newIngredient.price) return;
		const ingredient: Ingredient = {
			id: `ing-${Date.now()}`,
			name: newIngredient.name,
			price: parseFloat(newIngredient.price) || 0,
			quantity: parseFloat(newIngredient.quantity) || 1,
			unit: newIngredient.unit,
		};
		const updated = {
			...editingRecipe,
			ingredients: [...editingRecipe.ingredients, ingredient],
		};
		updateRecipe(updated);
		setNewIngredient({ name: "", price: "", quantity: "", unit: "" });
	};

	const removeIngredient = (ingId: string) => {
		if (!editingRecipe) return;
		const updated = {
			...editingRecipe,
			ingredients: editingRecipe.ingredients.filter((i) => i.id !== ingId),
		};
		updateRecipe(updated);
	};

	const sortedByCost = [...recipes].sort(
		(a, b) => calculateTotal(a.ingredients) - calculateTotal(b.ingredients),
	);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Recipe Cost</h1>
				<p>Track ingredient costs</p>
			</div>

			<div className="controls">
				<button className="new-btn" onClick={createNewRecipe}>
					+ New Recipe
				</button>
				{recipes.length > 1 && (
					<button
						className="compare-btn"
						onClick={() => setShowCompare(!showCompare)}
					>
						{showCompare ? "Hide Comparison" : "Compare Recipes"}
					</button>
				)}
			</div>

			{showCompare && (
				<div className="compare-section">
					<h3>Cost Comparison</h3>
					<div className="compare-list">
						{sortedByCost.map((recipe) => (
							<div key={recipe.id} className="compare-item">
								<span className="compare-name">{recipe.name}</span>
								<div className="compare-stats">
									<span className="compare-total">
										${calculateTotal(recipe.ingredients).toFixed(2)}
									</span>
									<span className="compare-serving">
										$
										{calculatePerServing(
											recipe.ingredients,
											recipe.servings,
										).toFixed(2)}
										/srv
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{!selectedRecipe && !isEditing && (
				<div className="recipe-list">
					{recipes.length === 0 ? (
						<div className="empty-state">
							<span className="empty-icon">📝</span>
							<p>No recipes yet</p>
							<p className="empty-hint">
								Create your first recipe to track costs
							</p>
						</div>
					) : (
						recipes.map((recipe) => (
							<div
								key={recipe.id}
								className="recipe-card"
								onClick={() => {
									setSelectedRecipe(recipe);
									setEditingRecipe(recipe);
								}}
							>
								<div className="recipe-info">
									<span className="recipe-name">{recipe.name}</span>
									<span className="recipe-meta">
										{recipe.ingredients.length} ingredients • {recipe.servings}{" "}
										servings
									</span>
								</div>
								<div className="recipe-cost">
									<span className="cost-total">
										${calculateTotal(recipe.ingredients).toFixed(2)}
									</span>
									<span className="cost-serving">
										$
										{calculatePerServing(
											recipe.ingredients,
											recipe.servings,
										).toFixed(2)}
										/srv
									</span>
								</div>
							</div>
						))
					)}
				</div>
			)}

			{isEditing && editingRecipe && (
				<div className="editor">
					<div className="editor-header">
						<input
							type="text"
							className="recipe-title-input"
							value={editingRecipe.name}
							onChange={(e) =>
								updateRecipe({ ...editingRecipe, name: e.target.value })
							}
							placeholder="Recipe name"
						/>
						<div className="servings-input">
							<label>Servings:</label>
							<input
								type="number"
								min="1"
								value={editingRecipe.servings}
								onChange={(e) =>
									updateRecipe({
										...editingRecipe,
										servings: parseInt(e.target.value) || 1,
									})
								}
							/>
						</div>
					</div>

					<div className="ingredients-section">
						<h3>Ingredients</h3>
						<div className="ingredients-list">
							{editingRecipe.ingredients.map((ing) => (
								<div key={ing.id} className="ingredient-row">
									<input
										type="text"
										value={ing.name}
										onChange={(e) => {
											const updated = {
												...editingRecipe,
												ingredients: editingRecipe.ingredients.map((i) =>
													i.id === ing.id ? { ...i, name: e.target.value } : i,
												),
											};
											updateRecipe(updated);
										}}
										placeholder="Ingredient"
										className="ing-name"
									/>
									<input
										type="number"
										step="0.01"
										value={ing.quantity}
										onChange={(e) => {
											const updated = {
												...editingRecipe,
												ingredients: editingRecipe.ingredients.map((i) =>
													i.id === ing.id
														? {
																...i,
																quantity: parseFloat(e.target.value) || 0,
															}
														: i,
												),
											};
											updateRecipe(updated);
										}}
										placeholder="Qty"
										className="ing-qty"
									/>
									<select
										value={ing.unit}
										onChange={(e) => {
											const updated = {
												...editingRecipe,
												ingredients: editingRecipe.ingredients.map((i) =>
													i.id === ing.id ? { ...i, unit: e.target.value } : i,
												),
											};
											updateRecipe(updated);
										}}
										className="ing-unit"
									>
										{unitOptions.map((u) => (
											<option key={u} value={u}>
												{u}
											</option>
										))}
									</select>
									<input
										type="number"
										step="0.01"
										value={ing.price}
										onChange={(e) => {
											const updated = {
												...editingRecipe,
												ingredients: editingRecipe.ingredients.map((i) =>
													i.id === ing.id
														? { ...i, price: parseFloat(e.target.value) || 0 }
														: i,
												),
											};
											updateRecipe(updated);
										}}
										placeholder="$"
										className="ing-price"
									/>
									<button
										className="remove-ing"
										onClick={() => removeIngredient(ing.id)}
									>
										×
									</button>
								</div>
							))}
						</div>

						<div className="add-ingredient">
							<input
								type="text"
								placeholder="Ingredient name"
								value={newIngredient.name}
								onChange={(e) =>
									setNewIngredient({ ...newIngredient, name: e.target.value })
								}
							/>
							<input
								type="number"
								placeholder="Qty"
								value={newIngredient.quantity}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										quantity: e.target.value,
									})
								}
							/>
							<select
								value={newIngredient.unit}
								onChange={(e) =>
									setNewIngredient({ ...newIngredient, unit: e.target.value })
								}
							>
								{unitOptions.map((u) => (
									<option key={u} value={u}>
										{u}
									</option>
								))}
							</select>
							<input
								type="number"
								step="0.01"
								placeholder="Price"
								value={newIngredient.price}
								onChange={(e) =>
									setNewIngredient({ ...newIngredient, price: e.target.value })
								}
							/>
							<button onClick={addIngredient}>Add</button>
						</div>
					</div>

					<div className="cost-summary">
						<div className="summary-row">
							<span>Total Cost:</span>
							<span className="summary-value">
								${calculateTotal(editingRecipe.ingredients).toFixed(2)}
							</span>
						</div>
						<div className="summary-row">
							<span>Per Serving:</span>
							<span className="summary-value">
								$
								{calculatePerServing(
									editingRecipe.ingredients,
									editingRecipe.servings,
								).toFixed(2)}
							</span>
						</div>
					</div>

					<div className="editor-actions">
						<button
							className="delete-recipe"
							onClick={() => deleteRecipe(editingRecipe.id)}
						>
							Delete Recipe
						</button>
						<button className="done-btn" onClick={() => setIsEditing(false)}>
							Done
						</button>
					</div>
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a2421 0%, #0d1512 100%);
          color: #e8ebe9;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
          z-index: 10;
        }
        .back-button:hover { color: white; }

        .header {
          text-align: center;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          background: linear-gradient(90deg, #4ecdc4, #44a08d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }

        .controls {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .new-btn, .compare-btn {
          padding: 0.75rem 1.25rem;
          border-radius: 2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .new-btn {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          border: none;
          color: white;
        }

        .compare-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }

        .compare-section {
          background: rgba(255,255,255,0.03);
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .compare-section h3 {
          margin: 0 0 0.75rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .compare-list { display: flex; flex-direction: column; gap: 0.5rem; }

        .compare-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.5rem;
        }

        .compare-name { font-weight: 500; }

        .compare-stats { display: flex; gap: 1rem; text-align: right; }

        .compare-total { color: #4ecdc4; font-weight: 600; }

        .compare-serving { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: rgba(255,255,255,0.4);
        }

        .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

        .empty-hint { font-size: 0.85rem; margin-top: 0.5rem; }

        .recipe-list { display: flex; flex-direction: column; gap: 0.75rem; }

        .recipe-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.04);
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: all 0.2s;
        }

        .recipe-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateX(4px);
        }

        .recipe-info { display: flex; flex-direction: column; gap: 0.25rem; }

        .recipe-name { font-weight: 600; font-size: 1.05rem; }

        .recipe-meta { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

        .recipe-cost { text-align: right; }

        .cost-total { display: block; font-size: 1.25rem; font-weight: 700; color: #4ecdc4; }

        .cost-serving { font-size: 0.75rem; color: rgba(255,255,255,0.5); }

        .editor {
          max-width: 600px;
          margin: 0 auto;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .recipe-title-input {
          flex: 1;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          padding: 0.5rem 0;
        }

        .recipe-title-input:focus { outline: none; border-color: #4ecdc4; }

        .servings-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .servings-input label { font-size: 0.85rem; color: rgba(255,255,255,0.5); }

        .servings-input input {
          width: 50px;
          padding: 0.4rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          color: white;
          text-align: center;
        }

        .ingredients-section h3 {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .ingredients-list { display: flex; flex-direction: column; gap: 0.5rem; }

        .ingredient-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .ing-name { flex: 2; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.5rem; color: white; }

        .ing-qty, .ing-unit, .ing-price { padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.5rem; color: white; }

        .ing-qty { width: 60px; }

        .ing-unit { width: 70px; }

        .ing-price { width: 70px; }

        .remove-ing {
          width: 28px;
          height: 28px;
          background: rgba(255,107,107,0.2);
          border: none;
          border-radius: 0.5rem;
          color: #ff6b6b;
          cursor: pointer;
          font-size: 1rem;
        }

        .add-ingredient {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .add-ingredient input, .add-ingredient select {
          padding: 0.6rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          color: white;
        }

        .add-ingredient input:first-child { flex: 2; min-width: 150px; }

        .add-ingredient button {
          padding: 0.6rem 1rem;
          background: #4ecdc4;
          border: none;
          border-radius: 0.5rem;
          color: #1a2421;
          font-weight: 600;
          cursor: pointer;
        }

        .cost-summary {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(78, 205, 196, 0.1);
          border-radius: 1rem;
          border: 1px solid rgba(78, 205, 196, 0.2);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .summary-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.05); }

        .summary-value { font-size: 1.25rem; font-weight: 700; color: #4ecdc4; }

        .editor-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .delete-recipe {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255,107,107,0.1);
          border: 1px solid rgba(255,107,107,0.3);
          border-radius: 0.75rem;
          color: #ff6b6b;
          cursor: pointer;
        }

        .done-btn {
          flex: 1;
          padding: 0.75rem;
          background: #4ecdc4;
          border: none;
          border-radius: 0.75rem;
          color: #1a2421;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
		</div>
	);
}
