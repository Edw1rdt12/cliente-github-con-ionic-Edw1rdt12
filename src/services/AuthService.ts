// Servicio de autenticación simple (usa localStorage)
// - login: guarda username y token (PAT) en localStorage
// - logout: elimina credenciales
// - isAuthenticated/getToken/getUsername: utilidades para la UI
const TOKEN_KEY = 'github_auth_token';
const USERNAME_KEY = 'github_auth_username';

class AuthService {
    // Guarda las credenciales en localStorage
    login(username: string, token: string) {
        if (username && token) {
            this.logout(); 
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USERNAME_KEY, username);
            return true;
        }
        return false;
    }
    // Elimina credenciales
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
    }

    // Indica si hay credenciales guardadas
    isAuthenticated(): boolean {
        return localStorage.getItem(TOKEN_KEY) !== null
         && localStorage.getItem(USERNAME_KEY) !== null;
    }

    // Devuelve el token PAT
    getToken(){
        return localStorage.getItem(TOKEN_KEY);
    }
    // Devuelve el usuario guardado
    getUsername(){
        return localStorage.getItem(USERNAME_KEY);
    }

    // Cabeceras básicas de autenticación (no utilizadas actualmente)
    getAuthHeaders() {
        const token = this.getToken();
        const username = this.getUsername();

        if (token && username) {
            return 'Basic ' + btoa(username + ':' + token);
        }
        return null;
    }
}

export default new AuthService();