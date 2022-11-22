import { ComponentBaseProps } from '@@@@/packages/ui/lib/models';
import { useLayoutEffect, useState } from 'react';

/**
 * Container proposal
 *
 * @author
 *
 * */
interface ContainerProps extends ComponentBaseProps {
  className: string;
  title: string;
  isOnline?: boolean;
  activeStep: number;
  showStepCount?: boolean;
  onBack: () => void;
  children?: React.ReactNode | null;
}

function useComponent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [Component, setComponent] = useState<
    React.ReactNode | React.ReactNode[] | null | undefined
  >();
  useLayoutEffect(() => {
    if (setComponent) {
      setComponent(Component);
    }
  }, [Component]);

  return {
    Component,
  };
}

function Container(props: ContainerProps) {
  const Header = useComponent();
  return (
    <div className={props?.className}>
      {/* <Header> */}
      {props?.children}
    </div>
  );
}

export default Container;
