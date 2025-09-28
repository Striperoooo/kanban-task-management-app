import { SidebarProvider } from './contexts/SidebarContext'
import Header from './components/Header'


function App() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-light-bg">
          <p>Main</p>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
