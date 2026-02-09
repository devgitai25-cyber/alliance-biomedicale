'use client';

import '../globals.css';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <body>
                {children}
            </body>
        </html>
    );
}
