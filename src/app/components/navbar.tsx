import Image from "next/image"
import Link from "next/link";

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                label: "Inicio",
                href: "/",
                visible: ["admin", "recepcionista", "doctor"]
            },
            {
                label: "Gestion de citas",
                href: "/GestionCitas",
                visible: ["admin", "recepcionista"]
            },
            {
                label: "Historias Clinicas ",
                href: "/HistoriasClinicasR",
                visible: ["admin", "recepcionista"]
            },
            {
                label: "Historias Clinicas ",
                href: "/HistoriasClinicasD",
                visible: ["doctor"]
            },
            {
                label: "Boleteria",
                href: "/Boleteria",
                visible: ["admin", "recepcionista"]
            }
        ]
    }
]
const Navbar = () => {
    return (
        <div className='flex items-center justify-between p-4'>
            {/* MENU */}
            <div className="flex flex-row gap-5 whitespace-nowrap">
                {menuItems.map((i) => (
                    <div className="hidden md:flex flex-row items-center gap-5 text-sm px-2" key={i.title}>
                        {i.items.map((item) => {
                            if (item.visible.includes("admin")) {
                                return (
                                    <Link href={item.href} key={item.label} className="flex items-center justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200 ">
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            }
                        })}
                    </div>
                ))}
            </div>
            {/* USER */}
            <div className='flex items-center gap-6 justify-end w-full'>
                <div className='flex flex-col'>
                    <span className="text-xs leading-3 font-medium">Rafael Corzo</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
                <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
            </div>
        </div>
    )
}

export default Navbar