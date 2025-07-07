import React, { useEffect, useRef, ComponentType, RefAttributes } from 'react';

type WithScrollToTopProps<P> = P;

export function withScrollToTop<P>(WrappedComponent: ComponentType<P>) {
  const ScrollToTop: React.FC<
    WithScrollToTopProps<P> & RefAttributes<HTMLDivElement>
  > = (props) => {
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      requestAnimationFrame(() => {
        if (componentRef.current) {
          componentRef.current.scrollTop = 0;
        }
      });
    }, []);

    return (
      <div ref={componentRef} style={{ overflowY: 'auto', maxHeight: '100%' }}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  return ScrollToTop;
}
