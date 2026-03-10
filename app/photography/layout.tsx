import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Photography",
};

export default function PhotographyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="-mx-6 sm:mx-0 w-screen sm:w-full min-h-screen overflow-x-hidden">
            {children}
        </div>
    );
}