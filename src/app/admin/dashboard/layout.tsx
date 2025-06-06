// app/dashboard/layout.tsx


import Sidebar from "@/components/sidebar"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="md:flex w-full h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">

                <main className="p-4">{children}</main>
            </div>
        </div>
    )
}
