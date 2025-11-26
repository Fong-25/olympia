import { useNavigate, Link } from "react-router-dom"

export default function Lobby() {
    const navigate = useNavigate()
    const handleTest = () => {
        navigate('/test')
        console.log('Navigated')
    }
    return (
        <>
            <button onClick={handleTest} className="bg-green-50">Hello World</button>
            <Link to='/test' >AAAAAAAA</Link>
        </>
    )
}