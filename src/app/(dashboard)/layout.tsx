import Link from "next/link";
import Menu from "../components/menu";


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex flex-col">
            {/* TOP */}
            <div className="h-[80px] bg-red-200 p-4 flex items-center justify-between fixed w-full z-10">
                <Link href="/" className="flex items-center justify-center justify-start gap-2">
                    <span className="hidden lg:block">ERPClinicaDental</span>
                </Link>
                <div className="ml-6 flex-grow flex items-center gap-6">
                    <Menu />
                </div>

            </div>
            {/* MAIN CONTENT  */}
            <div className="h-[86%] md:h-[88%] lg:h-[92%] xl:h-[92%] bg-blue-200 overflow-scroll">
            </div>
        </div>
    );
}