const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect("mongodb://localhost", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Banco de dados conectado');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;