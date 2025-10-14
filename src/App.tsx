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
          <Header />
          {/* Content area: on md+ place sidebar and main side-by-side */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            <Sidebar />
            <main className="flex-1 h-full min-h-0 flex flex-col bg-light-bg dark:bg-dark-page transition-colors">
              <BoardView />
            </main>
          </div>
        </div>
      </BoardProvider>
    </SidebarProvider>
  )
}

export default App
