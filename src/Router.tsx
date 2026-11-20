import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

// basename follows the Vite base URL, so the app also works when it is
// served from a sub-path (for example GitHub Pages) instead of the root.
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

export function Router() {
  return <RouterProvider router={router} />;
}
