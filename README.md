# The 100-App Challenge

This is the template repository for the 100-app challenge, also known as 100 Apps in 100 Minutes.

Fork this repository and use it as a scaffold to build and display your 100 apps.

The repository currently uses super-standard tooling, vite + React + TypeScript.

To run the dev server and view the website, simply run `yarn dev`.

## Example Prompts

Planning:
```
Create 100 novel app ideas. Make the app ideas as original as possible. Each app should be simple but be a real, useful app, not a toy. Write the ideas to a file with a paragraph of conceptual detail about how the app should be implemented (don't worry about technical details like specifying frameworks for now). It is okay for the apps to require a backend (they will have access to SQLite), but stay away from complex backend topics like authentication. The apps will be implemented as React components in a larger vite gallery application.

Write the ideas to a markdown file `IDEAS.md`.
```

Execution:
```
Review `IDEAS.md` and create a checklist file for each app and then start implementing. Keep track of each checklist and check items off the list as you complete them.

This repository contains a scaffold: a Cloudflare Pages website with optional functions for backend capability, and D1 for database (the binding is already set up, just create and run necessary migrations if needed). Replace the placeholder routes in the App file with the apps. Each app should have its own distinct visual style (use the frontend-design skill in .agents/skills) and a distinct icon for the home gallery rather than the default gradient. Each should be placed in its own directory in src/ with a top-level component included in the router in src/App.tsx. Use chrome mode or MCP and iterate until each app is beautiful and functional.

Do not modify the scaffold beyond inserting each app into the main gallery page.
```