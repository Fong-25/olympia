import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, User, LogOut } from 'lucide-react'

export default function Sidebar({ user }) {
    const location = useLocation()

    // const user = {
    //     id: "user_001",
    //     fullName: "John Doe",
    //     avatarUrl: null
    // }
    const isActive = (path) => location.pathname === path

    const getName = (fullName) => {
        return fullName.split(" ").pop()
    }

    return (
        <aside className='fixed left-0 top-0 h-screen w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col p-6 text-white'>
            {/* User info */}
            <div className='mb-8 pb-8 border-b border-zinc-800'>
                <div className='flex items-center gap-4 mb-4 justify-start w-full flex-row'>
                    {user.avatarUrl ? (
                        <>
                            <div>
                                <img
                                    src={user.avatarUrl || ""}
                                    alt={user.fullName}
                                    className='w-12 h-12 rounded-full object-cover flex items-center justify-center'
                                />
                            </div>
                            <span className='text-sm font-medium text-zinc-100'>
                                {getName(user.fullName)}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className='w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center'>
                                <User size={24} className='text-zinc-400' />
                            </div>
                            <span className='text-sm font-medium text-zinc-100'>
                                {getName(user.fullName)}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                <Link
                    to='/lobby'
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/lobby") || isActive("/") ? 'bg-zinc-700 text-white' : "text-zinc-400 hover:bg-zinc-800"
                        }`}
                >
                    <Home size={20} />
                    <span>Lobby</span>
                </Link>
                <Link
                    to='/profile'
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/profile") ? 'bg-zinc-700 text-white' : "text-zinc-400 hover:bg-zinc-800"
                        }`}
                >
                    <User size={20} />
                    <span>Profile</span>
                </Link>
            </nav>

            {/* Signout */}
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors">
                <LogOut size={20} />
                <span>Sign Out</span>
            </button>
        </aside>
    )
}