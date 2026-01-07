import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { logoGithub } from "ionicons/icons";
import './Login.css';
import React from "react";
import AuthService from "../services/AuthService";

const Login: React.FC = () => {
    const [username, setUsername] = React.useState('');
    const [token, setToken] = React.useState(''); 
    const [error, setError] = React.useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Validar ambos campos
        if (!username || !token) {
            setError('Por favor, ingresa tu usuario y token de Github.');
            return;
        }

        const success = AuthService.login(username, token);
        if (success) {
            window.location.href = '/tab1';
        } else {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

  return  (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Iniciar Sesión </IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
            <div className="login-container">
                <IonIcon icon= {logoGithub} className="login-logo"/>
                <h1>Inicio de sesión a Github</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <IonInput
                    className="login-field"
                    placeholder="Usuario"
                    type="text"
                    value={username}
                    onIonInput={e=> setUsername(e.detail.value ?? '')}
                    required
                    />

                    <IonInput
                    className="login-field"
                    placeholder="Github Token"
                    type="password"
                    value={token}
                    onIonInput={e=> setToken(e.detail.value ?? '')}
                    required
                    />

                    {error && (
                    <IonText color="danger" className="error-message">
                        {error}
                    </IonText>
                    )}

                    <IonButton expand="block" type="submit" className="login-button">
                    Iniciar Sesión
                    </IonButton>

                    <IonText color="medium" className="login-hint">
                    <p>Ingresa tu nombre y tu token de Github para continuar.</p>
                    </IonText>
                </form>
            </div>
        </IonContent>               
    </IonPage>  
    ); 
}



export default Login;