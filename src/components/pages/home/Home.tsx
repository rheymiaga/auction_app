
interface User {
    id: string;
    name: string;
    email: string;
}

interface HomeProps {
    user: User | null;
}


export const Home = ({ user }: HomeProps) => {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-4xl text-white/60">
                Home page
            </div>
        </div>
    )
}