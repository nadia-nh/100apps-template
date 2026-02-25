interface Env {
	DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	// The D1 database binding is available at context.env.DB
	// You can query it like: await context.env.DB.prepare('SELECT * FROM Users').all();

	return new Response(
		JSON.stringify({
			message: "Hello from the /test Pages Function!",
			d1BindingExists: !!context.env.DB,
		}),
		{
			headers: {
				"content-type": "application/json",
			},
		},
	);
};
