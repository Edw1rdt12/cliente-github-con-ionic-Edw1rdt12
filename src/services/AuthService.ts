const TOKEN_KEY = 'github_auth_token';
const USERNAME_KEY = 'github_auth_username';

class AuthService {
    login(username: string, token: string) {
        if (username && token) {
            this.logout(); 
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USERNAME_KEY, username);
            return true;
        }
        return false;
    }
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
    }

    isAuthenticated(): boolean {
        return localStorage.getItem(TOKEN_KEY) !== null
         && localStorage.getItem(USERNAME_KEY) !== null;
    }

    getToken(){
        return localStorage.getItem(TOKEN_KEY);
    }
    getUsername(){
        return localStorage.getItem(USERNAME_KEY);
    }

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