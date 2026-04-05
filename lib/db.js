import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    user: "zenora",
    host: "localhost",
    database: "zenora_db",
    password: "zenora123",
    port: 5433,
});

export default pool;