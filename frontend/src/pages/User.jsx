import { User } from "lucide-react"
import Sidebar from "../components/Sidebar"

export default function Profile() {
    const user = {
        id: "user_001",
        fullname: "John Doe",
        email: "john@example.com",
        avatarUrl: null,
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 bg-zinc-950 min-h-screen p-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">User Profile</h1>
                    <p className="text-zinc-400 text-lg">View and manage your profile information</p>
                </header>

                {/* Profile Card */}
                <section className="max-w-2xl mx-auto">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
                        {/* Avatar */}
                        <div className="flex justify-center mb-8">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl || "/placeholder.svg"}
                                    alt={user.fullname}
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <User size={64} className="text-zinc-600" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-6 text-center mb-8">
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">Full Name</p>
                                <p className="text-2xl font-semibold text-white">{user.fullname}</p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">Email</p>
                                <p className="text-xl text-white">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">User ID</p>
                                <p className="text-lg text-zinc-300 font-mono">{user.id}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 bg-white text-zinc-950 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors">
                                Edit Profile
                            </button>
                            <button className="flex-1 bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors">
                                Change Password
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}