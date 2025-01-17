import { createContext, ReactNode, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import DropdownItem from './DropdownItem';

interface DropdownContextProps {
  isOpen: boolean;
  toggleDropdown: () => void;
}

export const DropdownContext = createContext<DropdownContextProps>({
  isOpen: false,
  toggleDropdown: () => {},
});

const Dropdown = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <DropdownContext value={{ isOpen, toggleDropdown }}>
      <div className='relative inline-block'>{children}</div>
    </DropdownContext>
  );
};

Dropdown.Menu = DropdownMenu;
Dropdown.Toggle = DropdownToggle;
Dropdown.Item = DropdownItem;

export default Dropdown;
