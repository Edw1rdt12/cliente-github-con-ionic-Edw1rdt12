import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories, editRepository, deleteRepository } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => { 
  const[loading,setLoading] = useState<boolean>(false);
  const[repos,setRepos] = useState<RepositoryItem[]> ([]); 

    const loadRepos = async () => { 
      try {
        setLoading (true);
        const reposData = await fetchRepositories(); 
        setRepos(reposData);
      } catch (error) {
        console.error("Error cargando repositorios:", error);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    }; 

  const handleUpdate = async (repo: RepositoryItem, updates: Partial<RepositoryItem> = {}) => {
    if (!repo.owner || !repo.name) return;
    await editRepository(repo.owner, repo.name, updates ?? {});
    await loadRepos();
  };

  const handleDelete = async (repo: RepositoryItem) => {
    if (!repo.owner || !repo.name) return;
    await deleteRepository(repo.owner, repo.name);
    await loadRepos();
  };

  useIonViewDidEnter(() => { 
    console.log("IonViewDidEnter - Cargando Repositorios"); 
    loadRepos(); 
  }); 


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {repos.map((repo, index) => (
            <RepoItem
              key={index}
              repo={repo}
              onEdit={handleUpdate}
              onDelete={handleDelete}
            />
          ))}

        </IonList>  
        <LoadingSpinner isOpen={loading} />


      </IonContent>
    </IonPage>
  );
};

export default Tab1;