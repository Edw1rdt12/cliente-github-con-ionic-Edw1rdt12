import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList } from '@ionic/react';
import './Tab1.css';
import RepoItem from '../components/Repoitem';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {/* Repositorio original */}
          <RepoItem
            name="android-project"
            imageurl="https://cdn.pixabay.com/photo/2018/05/08/21/08/android-3383929_640.png"
          ></RepoItem>

          {/* Repositorio 1 añadido */}
          <RepoItem
            name="web-react-app"
            imageurl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
          ></RepoItem>

          {/* Repositorio 2 añadido */}
          <RepoItem
            name="backend-service-node"
            imageurl="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png"
          ></RepoItem>

          {/* Repositorio 3 añadido */}
          <RepoItem
            name="data-analysis-scripts"
            imageurl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png"
          ></RepoItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;