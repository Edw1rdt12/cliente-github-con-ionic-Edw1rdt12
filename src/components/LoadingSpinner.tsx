import { IonSpinner } from '@ionic/react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    isOpen: boolean;
}   

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-spinner-container">
                <IonSpinner name="crescent" color="danger" className="loading-spinner"></IonSpinner>
            </div>
        </div>
    );
};

export default LoadingSpinner;