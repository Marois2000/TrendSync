const Pool = require("pg").Pool

const pool = new Pool({
    user: "trendsync_user",
    password: "3BHt2xKgqYsNmvkuAiZtyoIrdHztTnL8",
    host: "dpg-cko1vtprfc9c73csgeg0-a.oregon-postgres.render.com",
    port: 5432,
    database: "trendsync",
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;