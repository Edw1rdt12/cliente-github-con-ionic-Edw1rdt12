// Página/formulario para crear repositorios
// - Valida nombre y maneja respuesta de la API
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonToast } from '@ionic/react';
import LoadingSpinner from '../components/LoadingSpinner';
import './Tab2.css';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [privateRepo, setPrivateRepo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggestedName, setSuggestedName] = useState<string | null>(null);

  // Use real createRepository from service
  const saveRepository = async () => {
    const trimmedName = name.trim();
    if (trimmedName === '') {
      setToastMessage('El nombre del repositorio es obligatorio');
      setShowToast(true);
      return;
    }

    // Validación local consistente con GitHub
    const NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
    if (!NAME_REGEX.test(trimmedName)) {
      setToastMessage('Nombre inválido: usa sólo letras, números, guiones (-), guiones bajos (_) o puntos (.)');
      setShowToast(true);
      return;
    }

    setSaving(true);

    try {
      // dynamic import from service
      const { createRepository } = await import('../services/GithubService');
      const created = await createRepository({ name: trimmedName, description: description.trim() || null, private: privateRepo });

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
      // Si el error indica que el nombre ya existe, generar una sugerencia
      if (message.toLowerCase().includes('ya existe') || message.toLowerCase().includes('name already exists') || message.toLowerCase().includes('already been taken')) {
        setSuggestedName(`${trimmedName}-1`);
      } else {
        setSuggestedName(null);
      }
      setToastMessage('Hubo un problema al crear el repositorio: ' + message);
      setShowToast(true);
    } finally {
      setSaving(false);
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
          {suggestedName && (
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ color: 'var(--ion-color-medium)', fontSize: 13 }}>Sugerencia:</div>
              <div style={{ fontWeight: 600 }}>{suggestedName}</div>
              <IonButton size="small" fill="clear" onClick={() => setName(suggestedName)}>
                Usar
              </IonButton>
            </div>
          )}

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

          <IonButton expand="block" className='form-field' onClick={saveRepository} disabled={!name.trim() || saving}>
            {saving ? 'Guardando...' : 'Guardar repositorio'}
          </IonButton>
        </div>

        <IonToast isOpen={showToast} message={toastMessage || "Repositorio creado"} duration={1200} onDidDismiss={() => setShowToast(false)} />
        <LoadingSpinner isOpen={saving} />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;