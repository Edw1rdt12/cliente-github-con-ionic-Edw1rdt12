// Componente que representa un repositorio en la lista
// - Soporta acciones rápidas (editar/eliminar) mediante item-sliding
// - Incluye enlace externo para abrir el repositorio en GitHub
import { IonItem, IonLabel, IonAvatar, IonBadge, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonButton } from '@ionic/react';
import { star, open } from 'ionicons/icons';
import './RepoItem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';

interface RepoProps {
  repo: RepositoryItem;
  onEdit?: (repo: RepositoryItem) => void;
  onDelete?: (repo: RepositoryItem) => void;
}

const RepoItem: React.FC<RepoProps> = ({ repo, onEdit, onDelete }) => {
  const { name, imageUrl, description, language, stars, owner } = repo;
  const repoUrl = owner ? `https://github.com/${owner}/${name}` : undefined;

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

        {repoUrl && (
          <IonButton slot="end" fill="clear" href={repoUrl} target="_blank" rel="noreferrer" aria-label="Abrir repositorio">
            <IonIcon icon={open} />
          </IonButton>
        )}

        {/* Botones de editar y eliminar visibles eliminados; se mantienen las opciones del item-slide */}
      </IonItem>

      {(onEdit || onDelete) && (
        <IonItemOptions side="end">
          {onEdit && <IonItemOption onClick={() => onEdit && onEdit(repo)} color="primary">Editar</IonItemOption>}
          {onDelete && <IonItemOption onClick={() => onDelete && onDelete(repo)} color="danger">Eliminar</IonItemOption>}
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default RepoItem; 