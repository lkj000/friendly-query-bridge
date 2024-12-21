import { AuthProvider } from '@/contexts/AuthContext'
import { Index } from '@/pages/Index'

function App() {
  return (
    <AuthProvider>
      <Index />
    </AuthProvider>
  )
}

export default App