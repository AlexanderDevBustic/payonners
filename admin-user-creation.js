// Script para crear un usuario administrador
const axios = require('axios');
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

// Datos del usuario administrador
const adminUser = {
  firstName: "Super",
  lastName: "Admin",
  identification: "ADMIN002",
  email: "superadmin@payonner.com",
  password: "SuperAdmin123",
  country: "Colombia",
  state: "Bogotá",
  address: "Calle Principal 123",
  phoneNumber: "123-456-7890"
};

async function createAdminUser() {
  try {
    // Paso 1: Registrar el usuario usando el endpoint de registro
    console.log('Registrando usuario...');
    const response = await axios.post('http://localhost:3000/auth/sign-up', adminUser);
    
    const userId = response.data.id;
    console.log(`Usuario creado con ID: ${userId}`);
    
    // Paso 2: Actualizar el rol del usuario a ADMIN en la base de datos
    console.log('Actualizando rol a ADMIN...');
    const connection = await mysql.createConnection(dbConnection);
    const updateQuery = 'UPDATE user SET role = ? WHERE id = ?';
    await connection.execute(updateQuery, ['ADMIN', userId]);
    await connection.end();
    
    console.log('¡Usuario administrador creado exitosamente!');
    console.log('Credenciales:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Contraseña: ${adminUser.password}`);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
  }

}

// Ejecutar la función
createAdminUser();