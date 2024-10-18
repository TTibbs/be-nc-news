<p align="center">
  <!-- Typing SVG by DenverCoder1 - https://github.com/DenverCoder1/readme-typing-svg -->
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Ubuntu&weight=700&size=28&duration=4000&pause=1000&color=188EF7&background=FFFFFF00&center=true&vCenter=true&random=false&width=435&lines=Backend%20News%20Server;Built%20With%20Express.js;Using%20PostgreSQL%20and%20SupaBase" alt="Typing SVG"/></a>
</p>

This is a backend server for a news application built with **Express.js** and **PostgreSQL**. The server provides API endpoints for managing news articles, topics, users, and comments. It supports CRUD operations and can be extended for various features such as user authentication, pagination, and more.

## Live View

You can view the API live and view the endpoints that are available [here](https://be-nc-news-92aj.onrender.com/api)

Note: If the data appears on one line, it can be hard to read. Installing a JSON formatter extension to your browser can make data like this easier to view. [This JSON Formatter](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) on the Chrome store is a good one.

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

## Environment Variables

The server requires environment variables to be set up in order to seed your databases and run the server correctly. Create 3 .env files, one called .env.development, another called .env.test and one more called .env.production.

You will need 2 variable names:

```JavaScript
PGDATABASE=your_sql_database_name
DATABASE_URL=your_supabase_link
```

PGDATABASE is used for both test and development env files, for test data and development data separately.

Make sure that you add a .gitignore file and add .env.* so that they are not pushed up to GitHub.

## Endpoints

1. GET /api - lists all available endpoints
2. GET /api/users - lists all users
3. GET /api/topics - lists all topics
4. GET /api/articles - lists all articles
5. GET /api/articles/:article_id - view an article by its id
6. GET /api/articles/:article_id/comments - view comments from an article by its id
7. POST /api/articles/:article_id/comments - Creates a new comment on the article by id
8. PATCH /api/articles/:article_id - Updates the votes on an article
9. DELETE /api/comments/:comment_id - Delete a comment by its id

## Running the Server and Seeding

You need to make sure you have these minimum versions of node.js and postgres in order for the project to run successfully:

- Node.js ^22.5.1
- Postgres ^14.13

Seeding the dev database:

```bash
npm run seed
```

Seeding the production database:

```bash
npm run seed-prod
```

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
