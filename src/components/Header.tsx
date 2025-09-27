import logoMobile from '../assets/logo-mobile.svg'
import iconChevDown from '../assets/icon-chevron-down.svg'
import iconAddTask from '../assets/icon-add-task-mobile.svg'
import iconEllipsis from '../assets/icon-vertical-ellipsis.svg'

export default function Header() {
    return (
        <header className='py-5 px-4 '>
            <div className='flex items-center'>
                <img src={logoMobile} alt="logo" className="w-6 h-25 mr-4 cursor-pointer" />

                <div className='flex items-center cursor-pointer'>
                    <span className="font-semibold mr-2">Platform Launch</span>
                    <img src={iconChevDown} alt="toggle sidebar icon" className='mt-1 w-2 h-1.5' />
                </div>

                <div className='ml-auto flex'>
                    <div className='bg-main-purple py-2.5 px-[18px] rounded-3xl cursor-pointer mr-4'>
                        <img src={iconAddTask} alt="add task icon" className='w-3 h-3' />
                    </div>
                    <div className='inline-flex items-center justify-center p-1 -m-1 cursor-pointer'>
                        <img src={iconEllipsis} alt="ellipsis icon" className='h-3.5 ' />
                    </div>
                </div>

            </div>
        </header>
    )
}