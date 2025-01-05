import Link from "next/link"

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                label: "Inicio",
                href: "/",
            },
            {
                label: "Gestion de citas",
                href: "/GestionCitas",
            },
            {
                label: "Historias Clinicas",
                href: "/HistoriasClinicas",
            },
            {
                label: "Boleteria",
                href: "/Boleteria",
            }
        ]
    }
]

const Menu = () => {
    return (
        <div className="text-sm flex flex-row">
            {menuItems.map((i) => (
                <div className="flex flex-row gap-4" key={i.title}>
                    {i.items.map((item) => (
                        <Link href={item.href} key={item.label} className="flex items-center justify-start gap-4 text-gray-500 py-2">
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Menu