import { User, Camera, X, Loader2 } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { useState, useEffect, useRef } from "react"
import { toast } from 'react-hot-toast'

export default function Profile() {
    // const user = {
    //     id: "user_001",
    //     fullname: "John Doe",
    //     email: "john@example.com",
    //     avatarUrl: null,
    // }

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ fullName: '', email: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const fileInputRef = useRef(null)

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
    useEffect(() => {
        fetchLobby()
    }, [])

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be less than 2MB')
            return
        }

        setError('')
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('avatar', file)

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/avatar`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            const result = await res.json()

            if (res.ok) {
                setSuccess('Avatar updated successfully!')
                // Refresh user data
                await fetchLobby()
                setTimeout(() => setSuccess(''), 3000)
                toast.success('Avatar updated successfully')
            } else {
                setError(result.message || 'Failed to upload avatar')
                toast.error(result.message || 'Failed to update avatar')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setError('Failed to upload avatar')
            toast.error('Something went wrong.')
        } finally {
            setUploading(false)
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await res.json()

            if (res.ok) {
                setSuccess('Profile updated successfully!')
                setIsEditing(false)
                await fetchLobby()
                toast.success('Profile updated successfully')
                setTimeout(() => setSuccess(''), 3000)
            } else {
                setError(result.message || 'Failed to update profile')
                toast.error(result.message || 'Failed to update profile')
            }
        } catch (err) {
            console.error('Update error:', err)
            setError('Failed to update profile')
            toast.error('Something went wrong.')
        }
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
            <main className="ml-64 flex-1 bg-zinc-950 min-h-screen p-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">User Profile</h1>
                    <p className="text-zinc-400 text-lg">View and manage your profile information</p>
                </header>

                <section className="max-w-2xl mx-auto">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                                {success}
                            </div>
                        )}

                        {/* Avatar Section */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                {data.user.avatarUrl ? (
                                    <img
                                        src={data.user.avatarUrl}
                                        alt={data.user.fullName}
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <User size={64} className="text-zinc-600" />
                                    </div>
                                )}

                                {/* Upload Overlay */}
                                {!uploading && (
                                    <button
                                        onClick={handleAvatarClick}
                                        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera size={32} className="text-white" />
                                    </button>
                                )}

                                {/* Loading Overlay */}
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                        <Loader2 size={32} className="text-white animate-spin" />
                                    </div>
                                )}

                                {/* Delete Button
                                {data.user.avatarUrl && !uploading && (
                                    <button
                                        onClick={handleDeleteAvatar}
                                        className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                )} */}

                                {/* Hidden File Input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <p className="text-center text-sm text-zinc-400 mb-8">
                            Click to upload • Max 2MB • JPG, PNG, WebP
                        </p>

                        {/* Profile Info */}
                        {!isEditing ? (
                            <div className="space-y-6 text-center mb-8">
                                <div>
                                    <p className="text-sm text-zinc-400 mb-1">Full Name</p>
                                    <p className="text-2xl font-semibold text-white">{data.user.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400 mb-1">Email</p>
                                    <p className="text-xl text-white">{data.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400 mb-1">User ID</p>
                                    <p className="text-lg text-zinc-300 font-mono">{data.user.id}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </form>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 bg-white text-zinc-950 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                    <button className="flex-1 bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors">
                                        Change Password
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setFormData({
                                                fullName: data.user.fullName,
                                                email: data.user.email
                                            })
                                            setError('')
                                        }}
                                        className="flex-1 bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}