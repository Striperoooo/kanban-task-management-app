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
          <Sidebar />
          <main className="flex-1 h-full bg-light-bg dark:bg-dark-page transition-colors">
            <BoardView />
          </main>
        </div>
      </BoardProvider>
    </SidebarProvider>
  )
}

export default App
