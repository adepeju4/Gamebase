import React from 'react';

export function useDispatchComp<P extends object>(Comp: React.ComponentType<P>, props: P) {
  return <Comp {...props} />;
}
