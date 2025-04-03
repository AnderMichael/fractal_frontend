import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <main className="p-6">
        <AppRoutes />
      </main>
    </BrowserRouter>
  )
}

export default App
