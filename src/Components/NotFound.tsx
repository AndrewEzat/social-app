import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <main className="text-center">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="my-3">The page you requested does not exist.</p>
            <Link className="text-blue-600 underline" to="/">
                Return to the register page
            </Link>
        </main>
    );
}
