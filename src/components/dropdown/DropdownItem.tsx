import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

const DropdownItem = ({ children, onClick }: Props) => {
  return (
    <div className='p-2 cursor-pointer hover:bg-slate-300' onClick={onClick}>
      {children}
    </div>
  );
};

export default DropdownItem;
