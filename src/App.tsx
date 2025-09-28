import { SidebarProvider } from './contexts/SidebarContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'


function App() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Sidebar />
        <main className="flex-1 bg-light-bg">
          <p>Main</p>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
