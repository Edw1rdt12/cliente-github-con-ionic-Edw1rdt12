import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonToast } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [privateRepo, setPrivateRepo] = useState(false);

  // Use real createRepository from service
  const saveRepository = async () => {
    if (name.trim() === '') {
      alert('El nombre del repositorio es obligatorio');
      return;
    }

    try {
      // dynamic import from service
      const { createRepository } = await import('../services/GithubService');
      const created = await createRepository({ name: name.trim(), description: description.trim() || null, private: privateRepo });

      // Store newly created repo locally so Tab1 can show it immediately
      try {
        const saved = JSON.parse(localStorage.getItem('created_repos') || '[]');
        saved.unshift(created);
        localStorage.setItem('created_repos', JSON.stringify(saved));
      } catch {
        localStorage.setItem('created_repos', JSON.stringify([created]));
      }

      setToastMessage(`Repositorio creado: ${created.name}`);
      setShowToast(true);

      // navigate back to /tab1 after a short delay
      setTimeout(() => {
        setShowToast(false);
        history.replace('/tab1');
      }, 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Hubo un problema al crear el repositorio: ' + message);
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de Repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="form-container"> 
          <IonInput
            value={name}
            onIonChange={(e: CustomEvent<{ value?: string | null }>) => setName(e.detail.value ?? '')}
            label="Nombre del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="android-project"
            className='form-field'
          />

          <IonTextarea
            value={description}
            onIonChange={(e: CustomEvent<{ value?: string | null }>) => setDescription(e.detail.value ?? '')}
            label="Descripción del Repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Este es un Repositorio de Android"
            className='form-field'
            rows={6}
          />

          <div className="form-field form-private">
            <label className="private-label">
              <input type="checkbox" checked={privateRepo} onChange={(e) => setPrivateRepo((e.target as HTMLInputElement).checked)} />{' '}
              Crear repositorio privado
            </label>
          </div>

          <IonButton expand="block" className='form-field' onClick={saveRepository} disabled={!name.trim()}>
            Guardar repositorio
          </IonButton>
        </div>

        <IonToast isOpen={showToast} message={toastMessage || "Repositorio creado"} duration={1200} onDidDismiss={() => setShowToast(false)} />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;