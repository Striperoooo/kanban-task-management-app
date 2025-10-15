import { SidebarProvider } from './contexts/SidebarContext'
import { BoardProvider } from './contexts/BoardContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BoardView from './components/BoardView'


function App() {
  return (
    <SidebarProvider>
      <BoardProvider>
        <div className="h-screen flex flex-col text-black dark:text-dark-text transition-colors">
          {/* Content area: on md+ place sidebar and main side-by-side */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0">
              <Header />
              <main className="flex-1 min-h-0 flex flex-col bg-light-bg dark:bg-dark-page transition-colors overflow-y-hidden md:pt-0 md:border-t md:border-transparent md:pl-0">
                <BoardView />
              </main>
            </div>
          </div>
        </div>
      </BoardProvider>
    </SidebarProvider>
  )
}

export default App
