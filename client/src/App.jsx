/**
 * @author Tyler Marois
 */
import { useState } from 'react'
import { Login } from './pages/login'
import { Home } from './pages/home'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});
  

  return (
      <DndProvider backend={HTML5Backend}>
        <div className='bg-background' style={{height: "100vh"}}>
          {login ? <Home user={user}/> : <Login userSetter={setUser} loginSetter={setLogin} />}
        </div>
      </DndProvider>
  )
}

export default App
