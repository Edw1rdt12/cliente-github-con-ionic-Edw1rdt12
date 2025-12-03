import { IonItem, IonLabel,IonThumbnail } from '@ionic/react';
import './RepoItem.css';

interface RepoProps {
  name: string; 
  imageurl:string;
}

const RepoItem: React.FC<RepoProps> = ({ name, imageurl }) => {
  return ( 
    <IonItem>
        <IonThumbnail slot="start"> 
            <img src={imageurl} alt={name}/>
        </IonThumbnail>
        <IonLabel> {name} </IonLabel>
    </IonItem>
    
  );
};

export default RepoItem;