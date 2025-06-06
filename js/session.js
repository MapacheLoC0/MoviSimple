/**
 * Gestión de sesión para MoviSimple
 * Implementa registro, login y gestión de sesión sin localStorage
 */

// Usuarios registrados (en memoria durante la sesión)
let registeredUsers = [];

// Usuario actual
let currentUser = null;

// Verificar si un correo ya está registrado
function isEmailRegistered(email) {
    return registeredUsers.some(user => user.email === email);
}

// Registrar un nuevo usuario
function registerUser(name, email, password) {
    // Verificar si el correo ya está registrado
    if (isEmailRegistered(email)) {
        throw new Error('Este correo electrónico ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = {
        name,
        email,
        password // En una aplicación real, la contraseña debería estar hasheada
    };

    // Agregar a la lista
    registeredUsers.push(newUser);
    return true;
}

// Iniciar sesión
function loginUser(email, password) {
    const user = registeredUsers.find(user => user.email === email && user.password === password);
    
    if (!user) {
        throw new Error('Correo o contraseña incorrectos');
    }

    // Guardar sesión
    currentUser = user;
    
    // Guardar en sessionStorage para mantener la sesión entre páginas
    sessionStorage.setItem('movisimple_current_user', JSON.stringify(user));
    
    return user;
}

// Cerrar sesión
function logoutUser() {
    currentUser = null;
    sessionStorage.removeItem('movisimple_current_user');
    window.location.href = 'index.html';
}

// Verificar si hay una sesión activa
function checkSession() {
    // Si ya tenemos un usuario en memoria, usarlo
    if (currentUser) {
        return currentUser;
    }
    
    // Intentar recuperar de sessionStorage
    const storedUser = sessionStorage.getItem('movisimple_current_user');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            return currentUser;
        } catch (e) {
            console.error("Error al cargar sesión:", e);
            sessionStorage.removeItem('movisimple_current_user');
            return null;
        }
    }
    
    return null;
}

// Proteger páginas que requieren autenticación
function protectPage() {
    const user = checkSession();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}

// Inicializar datos de ejemplo para pruebas
function initExampleData() {
    // Solo agregar datos de ejemplo si no hay usuarios registrados
    if (registeredUsers.length === 0) {
        registerUser('Usuario Demo', 'demo@example.com', 'password123');
        console.log('Datos de ejemplo inicializados');
    }
}

// Inicializar datos de ejemplo al cargar el script
initExampleData();
