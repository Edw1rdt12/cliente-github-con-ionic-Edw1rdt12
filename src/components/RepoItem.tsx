import { IonItem, IonLabel, IonAvatar, IonBadge, IonIcon } from '@ionic/react';
import { star } from 'ionicons/icons';
import './RepoItem.css';

interface RepoProps {
  name: string; 
  imageUrl?: string | null;
  description?: string | null;
  language?: string | null;
  stars?: number;
}

const RepoItem: React.FC<RepoProps> = ({ name, imageUrl, description, language, stars }) => {
  return ( 
    <IonItem lines="full" className="repo-item">
      <IonAvatar slot="start" className="repo-avatar">
        <img src={imageUrl || "https://via.placeholder.com/100?text=Repo"}  alt={name}/>
      </IonAvatar>
      <IonLabel className="repo-label"> 
        <div className="repo-name">{name}</div>
        {description ? <div className="repo-desc">{description}</div> : null}
        <div className="repo-meta">
          {language ? <IonBadge color="light" className="repo-language">{language}</IonBadge> : null}
          <div className="repo-stars">{stars ?? 0} <IonIcon icon={star} /></div>
        </div>
      </IonLabel>
    </IonItem>
    
  );
};

export default RepoItem;