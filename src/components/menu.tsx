import { ChevronRight, ContactRound, FileUser ,PawPrint} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";

const menuItems = [
    {
        title: 'MENU',
        items: [
            { icon: <PawPrint size={20} />, label: 'Pacientes', href: '/list/mascotas', visible: ['veterinario'] },
            { icon: <ContactRound size={20} />, label: 'Propietarios', href: '/list/owner', visible: ['veterinario'] },
            { icon: <FileUser size={20} />, label: 'Empleados', href: '/list/employees', visible: ['veterinario'] },
            // { icon: '', label: 'Historia Clinica', href: '/list/service', visible: ['veterinario'] },
            // { icon: '', label: 'Gestion de vacunación', href: '/list/ticket', visible: ['veterinario'] },
        ],
        visible: ['veterinario']
    },
];

const Menu = () => {
    const { role } = useUser();
    const pathname = usePathname();

    return (
    <div className="mt-4 text-md">
      {menuItems.map((section, index) =>
        section.visible.includes(role as string) && (
          <div
            className={`flex flex-col gap-2 ${index === 0 ? 'mb-6' : ''}`}
            key={section.title}
          >
            <span className="hidden lg:block text-textdark font-semibold my-2">
              {section.title}
            </span>
            {section.items.map((item) => {
              if (!item.visible.includes(role as string)) return null;
              const isActive = pathname === item.href;

              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center justify-center lg:justify-start gap-4  px-3 py-2 rounded-md 
                    ${ isActive
                      ? 'bg-backselectbutton text-textdefault font-semibold'
                      : 'hover:bg-backhoverbutton hover:text-textdefault'
                  }`}
                >
                <div >{item.icon}</div>
                <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Menu;
