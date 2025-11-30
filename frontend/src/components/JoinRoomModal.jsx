import { useState, useContext } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast'
import { SocketContext } from '../contexts/SocketContext'

export default function JoinRoomModal({ onClose, onSuccess }) {
    const { socket, isConnected } = useContext(SocketContext)
    const [roomName, setRoomName] = useState('')
    const [role, setRole] = useState('CANDIDATE')
    const [loading, setLoading] = useState(false)

    const handleJoin = () => {
        if (!roomName.trim()) {
            toast.error('Please enter a room name')
            return
        }

        if (!isConnected) {
            toast.error('Not connected to server')
            return
        }

        setLoading(true)

        // Listen for responses
        socket.once('room:joined', (data) => {
            setLoading(false)
            toast.success('Joined room successfully!')
            onSuccess(data.roomId)
        })

        socket.once('room:error', (data) => {
            setLoading(false)
            toast.error(data.message || 'Failed to join room')
        })

        // Emit join event
        socket.emit('room:join', {
            roomName: roomName.trim(),
            role
        })

        // Timeout
        setTimeout(() => {
            if (loading) {
                setLoading(false)
                toast.error('Request timeout')
            }
        }, 10000)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Join Room</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Room Name
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter room name"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Join as
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="CANDIDATE">Candidate (Player)</option>
                            <option value="MC">MC (Master of Ceremonies)</option>
                            <option value="VIEWER">Viewer (Audience)</option>
                        </select>
                    </div>

                    {!isConnected && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-yellow-400 text-sm">
                            Connecting to server...
                        </div>
                    )}

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
                            onClick={handleJoin}
                            disabled={loading || !isConnected}
                            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                'Join Room'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}