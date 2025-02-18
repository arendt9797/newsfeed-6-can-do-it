import Router from './shared/Router';
import { AuthProvider } from './context/AuthProvider';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <AuthProvider>
      <ToastContainer
        position="top-right" 
        autoClose={2000}
        hideProgressBar={false} 
        closeOnClick 
        rtl={false}
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark"
        // limit={1} // 알람 개수 제한
        toastStyle={{
          textAlign: "center",
        }}
      />
        <Router />
      </AuthProvider>
    </>
  );
}

export default App;
