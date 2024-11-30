import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserContext } from "../lib/context";
import { useContext } from 'react';


export default function Navbar() {

    const { user, username } = useContext(UserContext);


    return (
        <nav className="bg-white shadow dark:bg-gray-800">
            <div className="container mx-auto px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-semibold text-gray-800 dark:text-white">
                            Logo
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button asChild variant="ghost">
                            <Link href="/">Feed</Link>
                        </Button>
                        {username ? (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/admin">Write Posts</Link>
                                </Button>
                                <Link href={`/${username}`}>
                                <Avatar>
                                    <AvatarImage src={user?.photoURL} alt="Profile" />
                                    <AvatarFallback>{username[0]}</AvatarFallback>
                                </Avatar>
                                </Link>
                            </>
                            ) : (
                            <Button asChild variant="default">
                                <Link href="/enter">Log in</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}