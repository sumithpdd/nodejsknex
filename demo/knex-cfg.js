module.exports = {
    mysql: {
        client: "mysql",
        connection: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'my_db'
        }
    },
    sqlite: {
        client: "sqlite3",
        connection: {
            filename: './book.sqlite'
        }
    }

};