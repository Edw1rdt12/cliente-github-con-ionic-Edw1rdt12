import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { getUserInfo } from '../services/GithubService';
import { UserInfo } from '../services/UserInfo';
import './Tab3.css';


const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (err) {
      console.error('Error cargando información de usuario', err);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

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
        <IonCard>
          <img
            alt={userInfo?.login ?? 'avatar'}
            src={userInfo?.avatarUrl ?? 'https://via.placeholder.com/150'}
            style={{ width: 120, height: 120, borderRadius: 8, display: 'block', margin: '16px auto' }}
          />
          <IonCardHeader>
            <IonCardTitle>{userInfo?.name ?? userInfo?.login ?? 'Usuario'}</IonCardTitle>
            <IonCardSubtitle>{userInfo?.login ?? '—'}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>{userInfo?.bio ?? 'Sin biografía'}</IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Tab3;