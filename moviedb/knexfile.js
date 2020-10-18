module.exports = {
    development: {
        client: "sqlite3",
        connection: { filename: "./movie.sqlite" },
        migrations: { tableName: 'knex_migrations' },
        seeds: { directory: './seeds' },
        debug: false
    },

    production: {
        client: "mysql",
        connection: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'my_db',
        },
        migrations: { tableName: 'knex_migrations' },
        seeds: { directory: './seeds' },
        debug: true
    }
};