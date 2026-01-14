import { IonItem, IonLabel, IonAvatar, IonBadge, IonIcon, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import { star, create, trash } from 'ionicons/icons';
import './RepoItem.css';

interface RepoProps {
  name: string; 
  imageUrl?: string | null;
  description?: string | null;
  language?: string | null;
  stars?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RepoItem: React.FC<RepoProps> = ({ name, imageUrl, description, language, stars, onEdit, onDelete }) => {
  return (
    <IonItemSliding>
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

      <IonItemOptions side="end">
        <IonItemOption color="primary" onClick={onEdit} aria-label="Editar repositorio">
          <IonIcon slot="icon-only" icon={create} />
        </IonItemOption>
        <IonItemOption color="danger" onClick={onDelete} aria-label="Eliminar repositorio">
          <IonIcon slot="icon-only" icon={trash} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default RepoItem;