
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex">
            <div className="flex-1 bg-slate-100 overflow-scroll flex flex-col">
                <div className="flex items-center justify-start p-4 gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-1">
                        <Image src="/logodental.png" alt="logo" width={62} height={62} />
                        <span className="hidden lg:block font-bold">ERPCD</span>
                    </Link>
                    <div className=" flex-1 justify-between">
                        <Navbar />
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}