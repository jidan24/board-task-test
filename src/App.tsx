import { IonApp } from '@ionic/react';
import { useEffect } from 'react';
import { useBoardStore } from './store/boardStore';
import BoardPage from './pages/BoardPage';
import { GlobalToast } from './components/common/GlobalToast';
import './App.css';

const App: React.FC = () => {
  const themeMode = useBoardStore(state => state.themeMode);

  useEffect(() => {
    document.documentElement.classList.toggle('ion-palette-dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <IonApp>
      <BoardPage />
      <GlobalToast />
    </IonApp>
  );
};

export default App;
