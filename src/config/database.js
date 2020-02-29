module.exports = {
    dialect: 'postgres',
    host: '192.168.99.100',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    port: '5432',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
