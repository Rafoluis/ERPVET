import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";

const menuItems = [
    {
        title: 'MENU',
        items: [
            { label: 'Inicio', href: '/', visible: ['admin', 'recepcionista', 'doctor', 'odontologo'] },
            { label: 'Gestión de citas', href: '/list/appointments', visible: ['admin', 'recepcionista'] },
            { label: 'Pacientes', href: '/list/patients', visible: ['admin', 'recepcionista'] },
            { label: 'Servicios', href: '/list/service', visible: ['admin'] },
            { label: 'Historias Clínicas (Recepción)', href: '/HistoriasClinicasR', visible: ['admin', 'recepcionista'] },
            { label: 'Historias Clínicas (Doctor)', href: '/HistoriasClinicasD', visible: ['doctor', 'odontologo'] },
            { label: 'Boletería', href: '/list/ticket', visible: ['admin', 'recepcionista'] },
        ],
        visible: ['admin', 'recepcionista', 'doctor', 'odontologo']
    },
    {
        title: "OTROS",
        items: [
            { label: 'Empleados', href: '/admin', visible: ['admin'] },
            { label: 'Empresa', href: '/company', visible: ['admin'] }
        ],
        visible: ['admin']
    }
];

const Menu = () => {
    const { role } = useUser();
    const pathname = usePathname();

    return (
        <div className="mt-4 text-sm">
            {menuItems.map((section, index) =>
                section.visible.includes(role as string) && (
                    <div className={`flex flex-col gap-2 ${index === 0 ? "mb-6" : ""}`} key={section.title}>
                        <span className="hidden lg:block text-textdefault font-semibold my-2">{section.title}</span>
                        {section.items.map((item) => {
                            if (item.visible.includes(role as string)) {
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        href={item.href}
                                        key={item.label}
                                        className={`flex items-center justify-between py-2 px-4 rounded-md 
                                            ${isActive ? "bg-backselectbutton text-textdefault font-semibold" : "text-textdefault hover:bg-backhoverbutton hover:text-textdark"}`}
                                    >
                                        <span>{item.label}</span>
                                        {isActive && <ChevronRight size={14} className="text-textdark" />}
                                    </Link>
                                );
                            }
                            return null; // Evita errores si el elemento no es visible
                        })}
                    </div>
                )
            )}
        </div>
    );
}

export default Menu;
