// Script para verificar el usuario administrador directamente en la base de datos
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: './backend/.env' });

// Configuración de la base de datos desde DATABASE_URL
const dbUrl = process.env.DATABASE_URL || 'mysql://root:admin@localhost:3307/prueba_db';
const dbConfig = new URL(dbUrl);

// Crear conexión a MySQL
const dbConnection = {
  host: dbConfig.hostname,
  port: dbConfig.port,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.pathname.substring(1)
};

async function verifyAdminInDatabase() {
  let connection;
  try {
    // Conectar a la base de datos
    console.log('Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConnection);
    
    // Consultar el usuario administrador
    console.log('Consultando usuario administrador...');
    const [rows] = await connection.execute(
      'SELECT id, firstName, lastName, email, role FROM user WHERE email = ?', 
      ['superadmin@payonner.com']
    );
    
    if (rows.length > 0) {
      const user = rows[0];
      console.log('\nUsuario encontrado en la base de datos:');
      console.log('ID:', user.id);
      console.log('Nombre:', `${user.firstName} ${user.lastName}`);
      console.log('Email:', user.email);
      console.log('Rol:', user.role);
      
      // Verificar si el usuario tiene rol de administrador
      if (user.role === 'ADMIN') {
        console.log('\n¡CONFIRMADO! El usuario tiene rol de ADMINISTRADOR en la base de datos');
      } else {
        console.log('\nADVERTENCIA: El usuario NO tiene rol de administrador en la base de datos');
      }
    } else {
      console.log('\nUsuario no encontrado en la base de datos');
    }
  } catch (error) {
    console.error('Error al verificar el usuario en la base de datos:', error.message);
  } finally {
    // Cerrar la conexión
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar la función
verifyAdminInDatabase();