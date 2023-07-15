import './App.css';
import { UserContextProvider } from './context/UserContext';
import Routes from './screens/Routes';

function App() {

  return (
    <UserContextProvider>

      <Routes />
    </UserContextProvider>
  );
}

export default App;
