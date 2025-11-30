import { useState } from "react";
import { X, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CreateRoomModal({ onClose, onSuccess }) {
    const [roomName, setRoomName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (roomName.trim().length < 3) {
            toast.error('Room name must be at least 3 characters')
            return
        }
        setLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/create`, {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: roomName.trim() })
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Room created successfully')
                onSuccess()
            } else {
                toast.error(data.message || 'Failed to create room')
            }
        } catch (error) {
            console.error('Create room error:', error)
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Create New Room</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Room Name (acts as passcode)
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter unique room name"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            disabled={loading}
                            autoFocus
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            Others will use this name to join your room
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}