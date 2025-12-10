import { IonItem, IonLabel, IonThumbnail, IonAvatar } from '@ionic/react';
import './RepoItem.css';

interface RepoProps {
  name: string; 
  imageUrl?: string;
}

const RepoItem: React.FC<RepoProps> = ({ name, imageUrl }) => {
  return ( 
    <IonItem lines="full" className="repo-item">
      <IonAvatar slot="start" className="repo-avatar">
        <img src={imageUrl || "https://via.placeholder.com/100?text=Repo"}  alt={name}/>
      </IonAvatar>
      <IonLabel className="repo-label"> 
        <div className="repo-name">{name}</div>
      </IonLabel>
    </IonItem>
    
  );
};

export default RepoItem;