import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../shared/components';
import { PresenceSidebar } from '../features/presence/PresenceSidebar';

// Page components - lazy loaded for code splitting
import { MessagesPage } from '../features/messages/MessagesPage';
import { HandoffsPage } from '../features/handoffs/HandoffsPage';
import { JournalsPage } from '../features/journals/JournalsPage';
import { SmekbPage } from '../features/smekb/SmekbPage';
import { SearchPage } from '../features/search/SearchPage';

/**
 * Root layout component with sidebar
 */
function RootLayout() {
  return (
    <Layout sidebar={<PresenceSidebar />}>
      <Outlet />
    </Layout>
  );
}

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Redirect root to messages
      {
        index: true,
        element: <Navigate to="/messages" replace />,
      },
      {
        path: 'messages',
        element: <MessagesPage />,
      },
      {
        path: 'handoffs',
        element: <HandoffsPage />,
      },
      {
        path: 'journals',
        element: <JournalsPage />,
      },
      {
        path: 'smekb',
        element: <SmekbPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
]);
