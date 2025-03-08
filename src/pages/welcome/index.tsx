import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useThemeToken } from '@/theme/hooks';

import TrueFocus from './spring/TrueFocus';

function Welcome() {
  const themeToken = useThemeToken();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard/workbench');
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="flex h-screen items-center justify-center">
      <TrueFocus
        sentence="Welcome to the world of React"
        manualMode={false}
        blurAmount={5}
        borderColor={themeToken.colorPrimary}
        animationDuration={0.5}
        pauseBetweenAnimations={0.5}
      />
    </div>
  );
}

export default Welcome;
