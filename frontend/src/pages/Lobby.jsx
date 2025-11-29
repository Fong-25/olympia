import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { Plus, Trash2 } from "lucide-react"
import { toast } from 'react-hot-toast'
import { useState, useEffect } from "react"

export default function Lobby() {
    const [matches, setMatches] = useState([
        { id: "match_001", name: "Championship Final", createdBy: "user_001", createdAt: "2024-11-28" },
        { id: "match_002", name: "Friendly Match", createdBy: "user_002", createdAt: "2024-11-27" },
        { id: "match_003", name: "Tournament Round 1", createdBy: "user_001", createdAt: "2024-11-26" },
    ])

    const handleCreateMatch = () => {
        const newMatch = {
            id: `match_${Date.now()}`,
            name: `New Match ${matches.length + 1}`,
            createdBy: "user_001",
            createdAt: "2025-11-29",
        }
        setMatches([newMatch, ...matches])
    }

    const handleDeleteMatch = (id) => {
        setMatches(matches.filter((match) => match.id !== id))
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-56 flex-1 bg-zinc-950 min-h-screen p-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Match Lobby</h1>
                    <p className="text-zinc-400 text-lg">Manage and join your matches</p>
                </header>

                {/* Create Button */}
                <div className="mb-8">
                    <button
                        onClick={handleCreateMatch}
                        className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
                    >
                        <Plus size={20} />
                        Create New Match
                    </button>
                </div>

                {/* Matches List */}
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-6">Your Matches</h2>
                    <div className="grid gap-4">
                        {matches.length > 0 ? (
                            matches.map((match) => (
                                <div
                                    key={match.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center justify-between hover:border-zinc-700 transition-colors"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{match.name}</h3>
                                        <div className="flex gap-6 text-sm text-zinc-400">
                                            <span>ID: {match.createdBy}</span>
                                            <span>Created: {match.createdAt}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteMatch(match.id)}
                                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
                                <p className="text-zinc-400">No matches yet. Create one to get started!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}
