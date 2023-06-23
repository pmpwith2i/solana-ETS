import { ForwardRefExoticComponent, SVGProps } from 'react';

export type NavigationElement = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
  current: boolean;
};
