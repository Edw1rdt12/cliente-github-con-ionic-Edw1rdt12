import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Tab3.css';


const Tab3: React.FC = () => {
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
          <img alt="Silhouette of mountains" src="https://cdn-img.zerozero.pt/img/jogadores/new/45/16/434516_matias_romero_20250430000629.png" />
          <IonCardHeader>
            <IonCardTitle>Matias Romero</IonCardTitle>
            <IonCardSubtitle>matiaca25</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
        </IonCard>
        ;
      </IonContent>
    </IonPage>
  );
};

export default Tab3;