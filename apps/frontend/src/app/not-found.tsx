import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
                <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                Page Not Found
            </h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                Could not find the page you were looking for. It might have been removed, renamed, or did not exist in the first place.
            </p>
            <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                Return to Dashboard
            </Link>
        </div>
    );
}
