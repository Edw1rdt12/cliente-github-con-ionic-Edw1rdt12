import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
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
            <IonTitle size="large">Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <img alt="Silhouette of mountains" src="https://hsc.unm.edu/medicine/departments/internal-medicine/education/residents/_images/2025-26-resident-roster/mancero-montalvor_16041526_0d0ceda9-37bb-47f0-a1f1-646d90c5f51f.jpeg" />
          <IonCardHeader>
            <IonCardTitle>Edward Mancero</IonCardTitle>
            <IonCardSubtitle>Edw1rdt12</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
        </IonCard>

        <ExploreContainer name="Tab 3 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;