import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const Demo1 = lazy(() => import('@/pages/canvas/demo1'));

function Wrapper({ children }: any) {
  return <Suspense fallback={<CircleLoading />}>{children}</Suspense>;
}
const canvasRoutes: AppRouteObject[] = [
  {
    path: 'canvas',
    children: [
      {
        index: true,
        element: <Navigate to="demo1" replace />,
      },
      {
        path: 'demo1',
        element: <Demo1 />,
      },
    ],
  },
];

export default canvasRoutes;
