import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';

import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories } from '../services/GithubService';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<RepositoryItem[]>([]);

  const loadRepos = async () => {
    const reposData = await fetchRepositories();
    // Merge any locally created repos (to show immediately)
    let saved: RepositoryItem[] = [];
    try {
      saved = JSON.parse(localStorage.getItem('created_repos') || '[]');
    } catch {
      saved = [];
    }

    const merged = [
      ...saved,
      ...reposData.filter((r) => !saved.some((s) => s.name === r.name)),
    ];

    setRepos(merged);
  };

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
        <IonList className="repo-list">
          {repos.map((repo,index) => (
            <RepoItem 
              key={index}
              name={repo.name}
              imageUrl={repo.imageUrl}
              description={repo.description ?? undefined}
              language={repo.language ?? undefined}
              stars={repo.stars ?? 0}
            />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;