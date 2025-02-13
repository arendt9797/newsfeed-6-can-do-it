import Router from './shared/Router';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <>
      <AuthProvider>
        <Router />
        <div>App</div>
      </AuthProvider>
    </>
  );
}

export default App;
