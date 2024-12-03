<p align="center">
  <!-- Typing SVG by DenverCoder1 - https://github.com/DenverCoder1/readme-typing-svg -->
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Ubuntu&weight=700&size=28&duration=4000&pause=1000&color=188EF7&background=FFFFFF00&center=true&vCenter=true&random=false&width=435&lines=Backend%20News%20Server;Built%20With%20Express.js;Using%20PostgreSQL%20and%20SupaBase" alt="Typing SVG"/></a>
</p>

This is a backend server for a news application built with **Express.js** and **PostgreSQL**. The server provides API endpoints for managing news articles, topics, users, and comments. It supports CRUD operations and can be extended for various features such as user authentication, pagination, and more.

## Live View

You can view the API live and view the endpoints that are available [here](https://be-nc-news-92aj.onrender.com/api)

The frontend [repository](https://github.com/TTibbs/nc-news) - the live demo can be seen [here](https://nc-news-ten.vercel.app/articles?p=1)

## Quick Tip:

For a better experience viewing JSON responses, install a browser extension like [JSON Formatter](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)

## Table of Contents
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
- [Running the Server](#running-the-server)

## Technologies Used

<p align="center">
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="visual-studio-code-2019"/></a>
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="git"/></a>
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" /></a>
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="javascript"/></a>
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" /></a>
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" /></a>
<a href="https://devicon.dev/"><img width="45" height="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-plain.svg" /></a>
</p>

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TTibbs/be-nc-news.git
cd be-nc-news
npm install
```

## Set up the database:
Ensure you have PostgreSQL installed locally or use a hosted database such as **Supabase**.

If using Supabase:

- Sign up at [Supabase](https://supabase.com/)
- Create a new project and retrieve your database URL.

## Seed the database:

- For development:
```bash
npm run seed
```

- For production:
```bash
npm run seed-prod
```

## Environment Variables

Set up the following .env files for different environments:

.env.development
```makefile
PGDATABASE=your_development_database_name
```

.env.test
```makefile
PGDATABASE=your_test_database_name
```

.env.production
```makefile
DATABASE_URL=your_supabase_database_url
```

Notes:
- PGDATABASE is for local development and testing.
- DATABASE_URL is used in production (e.g., when deploying to Render).
- Ensure .env.* is added to .gitignore to avoid exposing credentials.

## Endpoints

| Method  | Endpoint | Description |
| ------------- | ------------- | ------------- |
| GET  | /api | Lists all available endpoints |
| GET  | /api/users  | Lists all users  |
| GET  | /api/topics  | Lists all topics  |
| GET  | /api/articles  | Lists all articles  |
| GET  | /api/articles/:article_id  | View an article by its ID  |
| GET  | /api/articles/:article_id/comments  | View comments on an article by its ID  |
| POST  | /api/articles/:article_id/comments  | Creates a new comment on the article  |
| PATCH  | /api/articles/:article_id  | Updates the votes on an article  |
| DELETE  | /api/comments/:comment_id  | Deletes a comment by its ID  |

## Running the Server and Seeding

You need to make sure you have these minimum versions of node.js and postgres in order for the project to run successfully:

- Node.js ^22.5.1
- Postgres ^14.13

To start the server:

```bash
npm run start
```

If you want to include more functionality and tests, you can run them with:

```bash
npm test
--- or shorthand
npm t
```

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
