import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const withPortal = (Element: ReactNode, node: HTMLElement) => {
  return ReactDOM.createPortal(Element, node!);
};

export const Portal = ({
  children,
  selector,
}: {
  children: ReactNode;
  selector: string;
}) => {
  const elRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    elRef.current = document.querySelector(selector);

    if (!elRef.current) {
      const el = document.createElement('div');
      el.setAttribute('id', selector.replace('#', ''));
      document.body.appendChild(el);
      elRef.current = el;
    }

    setMounted(true);
  }, [selector]);

  return mounted ? withPortal(children, elRef.current!) : null;
};
