# DGAP Brownie

Full-stack rebuild of dgapbrownie.in: React (Vite) frontend + Express API + SQLite (`node:sqlite`, Node 22+).

## Run
```
npm install
cp server/.env.example server/.env   # set JWT_SECRET and ADMIN_PASSWORD
# dev (two terminals)
export $(cat server/.env | xargs) && npm run dev:server
npm run dev:client                   # http://localhost:5173
# production
npm run build && export $(cat server/.env | xargs) && npm start   # http://localhost:4000
```
Admin panel: `/admin` (products, home/about text, contact messages).

## Content
`server/src/seed.js` holds **placeholder** content used to fill an empty database. Replace it with the real
content from the WordPress site (or edit through `/admin`).
