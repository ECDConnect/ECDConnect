import { ComponentBaseProps } from '@@@@/packages/ui/lib/models';

interface Props extends ComponentBaseProps {
  children?: React.ReactNode | null;
}

function Footer({ children, ...props }: Props) {
  return <footer {...props}>{children}</footer>;
}

export default Footer;
