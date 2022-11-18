import { ComponentBaseProps } from '@@@@/packages/ui/lib/models';
interface Props extends ComponentBaseProps {
  children?: React.ReactNode | null;
}

function Header({ children, ...props }: Props) {
  return <header>Header</header>;
}

export default Header;
