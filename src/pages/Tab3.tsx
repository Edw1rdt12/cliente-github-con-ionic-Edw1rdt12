import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Tab3.css';
import React, { useState } from 'react';
import { getUserInfo } from '../services/GithubService';
import { UserInfo } from '../interfaces/UserInfo';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import AuthService from '../services/AuthService';


const Tab3: React.FC = () => {

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const history = useHistory();


  const loadUserInfo = async () => {
    const info = await getUserInfo();
    setUserInfo(info);
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  });

  const handleLogout = () => {
    AuthService.logout();
    history.replace('/login');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="profile-wrapper">
          <IonCard className="profile-card">
            <div className="avatar-wrap">
              <img
                className="profile-avatar"
                alt={userInfo?.name ?? 'avatar'}
                src={userInfo?.avatarUrl ?? 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
              />
            </div>
            <IonCardHeader className="profile-header">
              <IonCardTitle className="profile-name">{userInfo?.name ?? userInfo?.login ?? 'Usuario'}</IonCardTitle>
              <IonCardSubtitle className="profile-login">{userInfo?.login}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent className="profile-bio">{userInfo?.bio ?? 'Sin biografía'}</IonCardContent>

            <div className="profile-actions">
              <IonButton expand="block" color="danger" onClick={handleLogout}>
                <IonIcon slot="start" icon={logOutOutline} />
                Cerrar Sesión
              </IonButton>
            </div>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;