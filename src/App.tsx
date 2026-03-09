import { useAuth } from './hooks/useAuth'
import { LoginForm } from './components/LoginForm'

export function App() {
    const { auth, login, logout } = useAuth()

    if (auth.status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (auth.status === 'unauthenticated') {
        return <LoginForm onLogin={login} />
    }

    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
            <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h1 className="text-lg font-semibold">AIOS Sample App</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400">Logged in as {auth.user.username}</span>
                    <button
                        onClick={logout}
                        className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 mb-6">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                        This is a sample AIOS app
                    </h2>
                    <p className="text-zinc-500 max-w-sm mx-auto">
                        You have successfully authenticated via the FlowScale API.
                    </p>
                </div>
            </main>
        </div>
    )
}
