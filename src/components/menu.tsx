import Link from "next/link";
import { useSession } from "next-auth/react";

const menuItems = [
    {
        title: 'MENU',
        items: [
            { label: 'Inicio', href: '/', visible: ['admin', 'recepcionista', 'doctor'] },
            { label: 'Gestión de citas', href: '/list/appointments', visible: ['admin', 'recepcionista'] },
            { label: 'Pacientes', href: '/list/patients', visible: ['admin', 'recepcionista'] },
            { label: 'Historias Clínicas (Recepción)', href: '/HistoriasClinicasR', visible: ['admin', 'recepcionista'] },
            { label: 'Historias Clínicas (Doctor)', href: '/HistoriasClinicasD', visible: ['doctor'] },
            { label: 'Boletería', href: '/ticketing', visible: ['admin', 'recepcionista'] },
            { label: 'Doctores', href: '/doctores', visible: ['admin'] },
        ],
    },
    {
        title: "OTROS",
        items: [{ label: 'Empleados', href: '/admin', visible: ['admin'] }],
    }
];

const Menu = () => {
    const { data: session } = useSession(); 
    const userRole = session?.user?.role?.toLowerCase() || ''; 

    return (
        <div className='mt-4 text-sm'>
            {menuItems.map((section, index) => (
                <div className={`flex flex-col gap-2 ${index === 0 ? 'mb-6' : ''}`} key={section.title}>
                    <span className="hidden lg:block text-textdefault font-semibold my-2">
                        {section.title}
                    </span>

                    {section.items
                        .filter(item => item.visible.includes(userRole as string)) 
                        .map(item => (
                            <Link
                                href={item.href}
                                key={item.label}
                                className="flex items-center justify-center lg:justify-start gap-4 text-textdefault py-2 md:px-2 rounded-md hover:bg-backhoverbutton hover:text-textdark">
                                <span>{item.label}</span>
                            </Link>
                        ))
                    }
                </div>
            ))}
        </div>
    );
}

export default Menu;
