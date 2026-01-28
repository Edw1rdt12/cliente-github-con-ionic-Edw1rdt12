import React, { useEffect, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonTextarea, IonButton, IonFooter, IonItem, IonLabel, IonButtons, IonToast, IonSpinner } from '@ionic/react';
import type { RepositoryItem } from '../interfaces/RepositoryItem';

// Modal reutilizable para crear o editar repositorios
// - Valida nombre y muestra errores al usuario
// - Si se edita un repo local lo actualiza en localStorage
// - Si se crea/edita remoto usa los servicios en src/services/GithubService


interface Props {
  isOpen: boolean;
  initial?: RepositoryItem | null;
  onDidDismiss: () => void;
  onSuccess: (repo: RepositoryItem) => void;
}

const NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

const RepoFormModal: React.FC<Props> = ({ isOpen, initial = null, onDidDismiss, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description ?? '');
      setIsPrivate(false);
    } else {
      setName('');
      setDescription('');
      setIsPrivate(false);
    }
  }, [initial, isOpen]);

  const close = () => {
    onDidDismiss();
  };

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setToast({ open: true, message: 'El nombre es obligatorio' });
      return;
    }
    if (!NAME_REGEX.test(trimmed)) {
      setToast({ open: true, message: 'Nombre inválido. Usa sólo letras, números, guiones o puntos.' });
      return;
    }

    setSaving(true);
    try {
      if (initial && initial.owner) {
        // Edit remote repo
        const { editRepository } = await import('../services/GithubService');
        const updated = await editRepository(initial.owner, initial.name, { name: trimmed, description: description || null, private: isPrivate });
        onSuccess(updated);
      } else if (initial && !initial.owner) {
        // Edit local repo
        try {
          const parsed = JSON.parse(localStorage.getItem('created_repos') || '[]');
          if (Array.isArray(parsed)) {
            const idx = parsed.findIndex((r: RepositoryItem) => r.name === initial.name);
            if (idx !== -1) {
              parsed[idx].name = trimmed;
              parsed[idx].description = description || null;
              localStorage.setItem('created_repos', JSON.stringify(parsed));
              onSuccess(parsed[idx]);
            }
          }
        } catch (e) {
          console.warn('Error actualizando repo local', e);
          setToast({ open: true, message: 'Error al actualizar repositorio local' });
        }
      } else {
        // Create new repo
        const { createRepository } = await import('../services/GithubService');
        const created = await createRepository({ name: trimmed, description: description || null, private: isPrivate });

        // Persist locally if GitHub didn't return owner (should return owner when created remotely)
        try {
          const parsed = JSON.parse(localStorage.getItem('created_repos') || '[]');
          parsed.unshift(created);
          localStorage.setItem('created_repos', JSON.stringify(parsed));
        } catch {
          localStorage.setItem('created_repos', JSON.stringify([created]));
        }

        onSuccess(created);
      }

      setToast({ open: true, message: 'Guardado con éxito' });
      setTimeout(() => {
        setSaving(false);
        close();
      }, 600);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setToast({ open: true, message: 'Error: ' + message });
      setSaving(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={close}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{initial ? 'Editar repositorio' : 'Crear repositorio'}</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={close}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={name} placeholder="nombre-del-repo" disabled={saving} onIonInput={(e: CustomEvent<{ value?: string | null }>) => setName(e.detail.value ?? '')} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Descripción</IonLabel>
          <IonTextarea value={description} disabled={saving} onIonInput={(e: CustomEvent<{ value?: string | null }>) => setDescription(e.detail.value ?? '')} rows={4} />
        </IonItem>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 14 }}>
            <input type="checkbox" disabled={saving} checked={isPrivate} onChange={(e) => setIsPrivate((e.target as HTMLInputElement).checked)} />{' '}
            Repositorio privado
          </label>
        </div> 
      </IonContent>

      <IonFooter>
        <div style={{ padding: 12, display: 'flex', gap: 8 }}>
          <IonButton fill="outline" onClick={close} disabled={saving}>Cancelar</IonButton>
          <IonButton onClick={save} disabled={saving}>{saving ? (<><IonSpinner name="crescent" /> Guardando...</>) : (initial ? 'Guardar cambios' : 'Crear repositorio')}</IonButton> 
        </div>
      </IonFooter>

      <IonToast isOpen={toast.open} message={toast.message} duration={1500} onDidDismiss={() => setToast({ open: false, message: '' })} />
    </IonModal>
  );
};

export default RepoFormModal;
