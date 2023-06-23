import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const withModal = (Element: ReactNode, node: HTMLElement) => {
  return ReactDOM.createPortal(Element, node!);
};

export const Portal = ({ children }: { children: ReactNode }) => {
  const elRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    elRef.current = document.querySelector('#modal-container');
    setMounted(true);
  }, []);

  return mounted ? withModal(children, elRef.current!) : null;
};
