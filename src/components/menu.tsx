import Link from "next/link";

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
    return (
        < div className='mt-4 text-sm' >
            {menuItems.map((i, index) => (
                <div className={`flex flex-col gap-2 ${index === 0 ? 'mb-6' : ''}`} key={i.title} >
                    <span className="hidden lg:block text-textdefault font-semibold my-2">
                        {i.title}
                    </span>
                    {i.items.map((item) => {
                        if (item.visible.includes('admin')) {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className="flex items-center justify-center lg:justify-start gap-4 text-textdefault py-2 md:px-2 rounded-md hover:bg-backhoverbutton hover:text-textgray ">
                                    <span>{item.label}</span>
                                </Link>
                            );
                        }
                    })}
                </div>
            ))
            }
        </div >
    )
}

export default Menu