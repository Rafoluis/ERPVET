import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: 'MENU',
        items: [
            {
                label: 'Inicio',
                href: '/',
                visible: ['admin', 'recepcionista', 'doctor'],
            },
            {
                label: 'Gestion de citas',
                href: '/list/appointments',
                visible: ['admin', 'recepcionista'],
            },
            {
                label: 'Agenda de citas',
                href: '/list/appointmentcalendar',
                visible: ['admin', 'doctor'],
            },
            {
                label: 'Pacientes',
                href: '/list/patients',
                visible: ['admin', 'recepcionista'],
            },
            {
                label: 'Historias Clinicas ',
                href: '/HistoriasClinicasR',
                visible: ['admin', 'recepcionista'],
            },
            {
                label: 'Historias Clinicas ',
                href: '/HistoriasClinicasD',
                visible: ['doctor'],
            },
            {
                label: 'Boleteria',
                href: '/ticketing',
                visible: ['admin', 'recepcionista'],
            },
            {
                label: 'Doctores',
                href: '/doctores',
                visible: ['admin'],
            },
        ],
    },
    {
        title: "OTROS",
        items: [
            {
                label: 'Usuarios',
                href: '/usuarios',
                visible: ['admin'],
            },
        ],

    }
];


const Menu = () => {
    const pathname = usePathname();

    return (
        <div className="mt-4 text-sm">
            {menuItems.map((section, index) => (
                <div className={`flex flex-col gap-2 ${index === 0 ? "mb-6" : ""}`} key={section.title}>
                    <span className="hidden lg:block text-textdefault font-semibold my-2">{section.title}</span>
                    {section.items.map((item) => {
                        if (item.visible.includes("admin")) { // rol
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className={`flex items-center justify-between py-2 px-4 rounded-md 
                                        ${isActive ? "bg-backselectbutton text-textdefault font-semibold" : "text-textdefault hover:bg-backhoverbutton hover:text-textdark"}`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && <ChevronRight size={14} className="text-textdark" color="white" />}
                                </Link>
                            );
                        }
                    })}
                </div>
            ))}
        </div>
    );
};

export default Menu;