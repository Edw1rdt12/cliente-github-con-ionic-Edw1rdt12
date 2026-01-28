import React from 'react';
import './ExploreContainer.css';

interface Props {
  name?: string;
}

const ExploreContainer: React.FC<Props> = ({ name = '' }) => {
  return (
    <div className="explore-container">
      <div className="explore-inner">
        <strong>{name}</strong>
      </div>
    </div>
  );
};

export default ExploreContainer;
