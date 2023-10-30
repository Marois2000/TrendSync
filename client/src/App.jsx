/**
 * @author Tyler Marois
 */
import { useState } from 'react'
import { Login } from './pages/login'
import { Home } from './pages/home'

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({})

  return (
      <div className='bg-background' style={{height: "100vh"}}>
        {login ? <Home user={user}/> : <Login userSetter={setUser} loginSetter={setLogin} />}
      </div>
  )
}

export default App
