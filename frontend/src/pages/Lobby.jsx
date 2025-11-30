import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { Plus, Trash2, Sword, Edit } from "lucide-react"
import { toast } from 'react-hot-toast'
import { useState, useEffect } from "react"
import CreateRoomModal from "../components/CreateRoomModal"
import JoinRoomModal from "../components/JoinRoomModal"

export default function Lobby() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showJoinModal, setShowJoinModal] = useState(false)
    const [rooms, setRooms] = useState({ created: [], participated: [] })

    // // Placeholder room, use room from the data constant after implement room data
    // const [matches, setMatches] = useState([
    //     { id: "match_001", name: "Championship Final", createdBy: "user_001", createdAt: "2024-11-28" },
    //     { id: "match_002", name: "Friendly Match", createdBy: "user_002", createdAt: "2024-11-27" },
    //     { id: "match_003", name: "Tournament Round 1", createdBy: "user_001", createdAt: "2024-11-26" },
    // ])

    // const handleCreateMatch = () => {
    //     const newMatch = {
    //         id: `match_${Date.now()}`,
    //         name: `New Match ${matches.length + 1}`,
    //         createdBy: "user_001",
    //         createdAt: "2025-11-29",
    //     }
    //     setMatches([newMatch, ...matches])
    // }

    // const handleDeleteMatch = (id) => {
    //     setMatches(matches.filter((match) => match.id !== id))
    // }

    const fetchLobby = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lobby`, {
                credentials: "include",
            })
            if (res.ok) {
                const result = await res.json()
                setData(result)
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err)
        } finally {
            setLoading(false)
        }
    }
    const fetchRooms = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/my-rooms`, {
                credentials: "include",
            })
            if (res.ok) {
                const result = await res.json()
                setRooms({
                    created: result.createdRooms || [],
                    participated: result.participatedRooms || []
                })
            }
        } catch (err) {
            console.error("Rooms fetch error:", err)
        }
    }
    useEffect(() => {
        fetchLobby()
        fetchRooms()
    }, [])

    const handleDeleteRoom = async (roomId) => {
        if (!confirm("Are you sure you want to delete this room?")) return

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`, {
                method: "DELETE",
                credentials: "include",
            })
            if (res.ok) {
                toast.success("Room deleted successfully")
                fetchRooms()
            } else {
                const data = await res.json()
                toast.error(data.message || "Failed to delete room")
            }
        } catch (err) {
            console.error("Delete room error:", err)
            toast.error("Failed to delete room")
        }
    }

    const handleRoomCreated = () => {
        setShowCreateModal(false)
        fetchRooms()
    }

    const handleRoomJoined = (roomId) => {
        setShowJoinModal(false)
        navigate(`/room/${roomId}`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="flex">
            <Sidebar user={data.user} />
            <main className="ml-56 flex-1 bg-zinc-950 min-h-screen p-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Match Lobby</h1>
                    <p className="text-zinc-400 text-lg">Manage and join your matches</p>
                </header>

                {/* Create Button */}
                <div className="flex items-center justify-start gap-8">
                    <div className="mb-8">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
                        >
                            <Plus size={20} />
                            Create New Match
                        </button>
                    </div>
                    <div className="mb-8">
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
                        >
                            <Sword size={20} />
                            Join a Match
                        </button>
                    </div>
                </div>

                {/* Created Rooms */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-6">Your Rooms</h2>
                    <div className="grid gap-4">
                        {rooms.created.length > 0 ? (
                            rooms.created.map((room) => (
                                <div
                                    key={room.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center justify-between hover:border-zinc-700 transition-colors"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{room.name}</h3>
                                        <div className="flex gap-6 text-sm text-zinc-400">
                                            <span>Created: {new Date(room.createdAt).toLocaleDateString()}</span>
                                            <span>Participants: {room.participants?.length || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/room/${room.id}/questions`)}
                                            className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room.id)}
                                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
                                <p className="text-zinc-400">No rooms yet. Create one to get started!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Participated Rooms */}
                {rooms.participated.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">Joined Rooms</h2>
                        <div className="grid gap-4">
                            {rooms.participated.map((room) => (
                                <div
                                    key={room.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center justify-between hover:border-zinc-700 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/room/${room.id}`)}
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{room.name}</h3>
                                        <div className="flex gap-6 text-sm text-zinc-400">
                                            <span>Role: {room.myRole}</span>
                                            <span>Host: {room.createdBy?.fullName}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            {showCreateModal && (
                <CreateRoomModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleRoomCreated}
                />
            )}

            {showJoinModal && (
                <JoinRoomModal
                    onClose={() => setShowJoinModal(false)}
                    onSuccess={handleRoomJoined}
                />
            )}
        </div>
    )
}
