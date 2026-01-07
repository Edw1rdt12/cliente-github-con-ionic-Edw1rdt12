import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, IonSpinner, IonButton, IonText, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories } from '../services/GithubService';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const loadRepos = async () => {
    setError(null);
    setLoading(true);
    try {
      const reposDataRaw = await fetchRepositories();

      // Asegurarse de que reposData sea un array y sanear elementos nulos
      const reposData = Array.isArray(reposDataRaw) ? reposDataRaw.filter((r) => r && typeof r.name === 'string' && r.name.trim() !== '') : [];

      // Merge any locally created repos (to show immediately)
      let saved: RepositoryItem[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('created_repos') || '[]');
        if (Array.isArray(parsed)) {
          saved = parsed.filter((s) => s && typeof s.name === 'string' && s.name.trim() !== '');
        } else {
          saved = [];
        }
      } catch (err) {
        console.warn('No se pudo parsear created_repos:', err);
        saved = [];
      }

      console.debug('fetchRepositories -> reposData length:', reposData.length);
      console.debug('created_repos (local) -> length:', saved.length);

      // Evitar errores al comparar cuando hay elementos inválidos
      const merged = [
        ...saved,
        ...reposData.filter((r) => !saved.some((s) => s.name === r.name)),
      ];

      console.debug('merged repos length:', merged.length, merged);
      setRepos(merged);

      if (merged.length === 0) {
        setError('No hay repositorios para mostrar.');
      }
    } catch (err) {
      console.error('Error cargando repos:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Error al cargar repositorios. Revisa tu token o conexión.');
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete repo handler (supports remote and local)
  const handleDelete = async (repo: RepositoryItem) => {
    const ok = window.confirm(`¿Eliminar repositorio "${repo.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    try {
      if (repo.owner) {
        // Remote delete
        await (await import('../services/GithubService')).deleteRepository(repo.owner, repo.name);
      }

      // Remove from local created_repos if present
      try {
        const parsed = JSON.parse(localStorage.getItem('created_repos') || '[]');
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((s: RepositoryItem) => s.name !== repo.name);
          localStorage.setItem('created_repos', JSON.stringify(filtered));
        }
      } catch (e) {
        console.warn('Error updating local created_repos after delete', e);
      }

      // Remove from UI
      setRepos((prev) => prev.filter((r) => r.name !== repo.name));
      setToastMessage('Repositorio eliminado');
      setShowToast(true);
    } catch (err) {
      console.error('Error borrando repo', err);
      const message = err instanceof Error ? err.message : String(err);
      setToastMessage('No se pudo eliminar: ' + message);
      setShowToast(true);
    }
  };

  // Edit repo handler (supports remote and local)
  const handleEdit = async (repo: RepositoryItem) => {
    const newName = window.prompt('Nuevo nombre del repositorio', repo.name);
    if (newName === null) return; // cancel
    const trimmed = newName.trim();
    if (!trimmed) { alert('Nombre no puede estar vacío'); return; }

    const newDesc = window.prompt('Nueva descripción (vacío para dejar igual)', repo.description ?? '') ?? '';

    try {
      let updated: RepositoryItem | null = null;
      if (repo.owner) {
        updated = await (await import('../services/GithubService')).editRepository(repo.owner, repo.name, { name: trimmed, description: newDesc || null });
      } else {
        // Update local stored repo
        try {
          const parsed = JSON.parse(localStorage.getItem('created_repos') || '[]');
          if (Array.isArray(parsed)) {
            const idx = parsed.findIndex((s: RepositoryItem) => s.name === repo.name);
            if (idx !== -1) {
              parsed[idx].name = trimmed;
              parsed[idx].description = newDesc || null;
              localStorage.setItem('created_repos', JSON.stringify(parsed));
              updated = parsed[idx];
            }
          }
        } catch (e) {
          console.warn('Error updating local created_repos', e);
        }
      }

      if (updated) {
        setRepos((prev) => prev.map((r) => (r.name === repo.name ? updated as RepositoryItem : r)));
        setToastMessage('Repositorio actualizado');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error editando repo', err);
      const message = err instanceof Error ? err.message : String(err);
      setToastMessage('No se pudo editar: ' + message);
      setShowToast(true);
    }
  };

  const history = useHistory();

  useIonViewDidEnter(() => {
    console.log ("IonViewDidEnter: Cargando repositorios...");  
    loadRepos();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="page-title">Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <IonText color="medium">{error}</IonText>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <IonButton onClick={loadRepos}>Reintentar</IonButton>
              {(error.includes('No hay token') || error.includes('No autorizado')) && (
                <IonButton color="primary" onClick={() => history.push('/login')}>Ir a Login</IonButton>
              )}
            </div>
          </div>
        ) : repos.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <IonText color="medium">No hay repositorios para mostrar.</IonText>
            <div style={{ marginTop: 16 }}>
              <IonButton onClick={loadRepos}>Actualizar</IonButton>
            </div>
          </div>
        ) : (
          <IonList className="repo-list">
            {repos.map((repo,index) => (
              <RepoItem 
                key={index}
                name={repo.name}
                imageUrl={repo.imageUrl}
                description={repo.description ?? undefined}
                language={repo.language ?? undefined}
                stars={repo.stars ?? 0}
                onEdit={() => handleEdit(repo)}
                onDelete={() => handleDelete(repo)}
              />
            ))}
          </IonList>
        )}

        <IonToast isOpen={showToast} message={toastMessage} duration={1500} onDidDismiss={() => setShowToast(false)} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;