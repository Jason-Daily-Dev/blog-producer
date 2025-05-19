import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const TopRightUserInfo: React.FC = () => {
  const { user, logout } = useAuth0();

  return (
    <div
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <span>👤 {user?.name}</span>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    </div>
  );
};

export default TopRightUserInfo;