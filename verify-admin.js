// Script para verificar el inicio de sesión del usuario administrador
const axios = require('axios');

async function verifyAdminLogin() {
  try {
    // Intentar iniciar sesión con las credenciales del administrador
    console.log('Verificando inicio de sesión del administrador...');
    const response = await axios.post('http://localhost:3000/auth/sign-in', {
      email: 'superadmin@payonner.com',
      password: 'SuperAdmin123'
    });
    
    // Obtener el token de acceso
    const accessToken = response.data.accessToken;
    console.log('Inicio de sesión exitoso!');
    console.log('Token de acceso:', accessToken);
    
    // Decodificar el token para verificar el rol (sin verificar la firma)
    const tokenParts = accessToken.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('\nInformación del usuario:');
      console.log('ID:', payload.sub);
      console.log('Email:', payload.email);
      console.log('Rol:', payload.role);
      console.log('Nombre completo:', payload.fullName);
      
      // Verificar si el usuario tiene rol de administrador
      if (payload.role === 'ADMIN') {
        console.log('\n¡CONFIRMADO! El usuario tiene rol de ADMINISTRADOR');
      } else {
        console.log('\nADVERTENCIA: El usuario NO tiene rol de administrador');
      }
    }
  } catch (error) {
    console.error('Error al verificar el usuario administrador:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
  }
}

// Ejecutar la función
verifyAdminLogin();