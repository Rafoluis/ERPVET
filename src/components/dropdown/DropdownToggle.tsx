import { ReactNode, use } from 'react';
import { DropdownContext } from './Dropdown';

interface Props {
  children: ReactNode;
}

const DropdownToggle = ({ children }: Props) => {
  const { toggleDropdown } = use(DropdownContext);

  return (
    <div className='p-3 cursor-pointer' onClick={toggleDropdown}>
      {children}
    </div>
  );
};

export default DropdownToggle;
