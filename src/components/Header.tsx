import logoMobile from '../assets/logo-mobile.svg'
import iconChevDown from '../assets/icon-chevron-down.svg'
import iconChevUp from '../assets/icon-chevron-up.svg'
import iconAddTask from '../assets/icon-add-task-mobile.svg'
import iconEllipsis from '../assets/icon-vertical-ellipsis.svg'
import { useSidebar } from '../contexts/SidebarContext';
import { useBoard } from '../contexts/BoardContext';

export default function Header() {

    const { isOpen, toggle, close } = useSidebar()
    const { selectedBoard } = useBoard()

    return (
        <header className='py-4 px-4 h-16 relative'>
            <nav className='flex items-center'>
                <img src={logoMobile} alt="logo" className="w-6 h-25 mr-4 cursor-pointer" />

                <div
                    className='flex items-center cursor-pointer'
                    onClick={toggle}
                >
                    <span className="font-bold text-lg mr-2">{selectedBoard.name}</span>
                    <img src={isOpen ? iconChevUp : iconChevDown} alt="toggle sidebar icon" className='mt-1 w-2 h-1.5' />
                </div>

                <div className='ml-auto flex'>
                    <div className='bg-main-purple py-2.5 px-[18px] rounded-3xl cursor-pointer mr-4'>
                        <img src={iconAddTask} alt="add task icon" className='w-3 h-3' />
                    </div>
                    <div className='inline-flex items-center justify-center p-1 -m-1 cursor-pointer'>
                        <img src={iconEllipsis} alt="ellipsis icon" className='h-3.5 ' />
                    </div>
                </div>
            </nav>
        </header>
    )
}