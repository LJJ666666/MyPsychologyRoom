import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import { StoryDetailPage } from '../pages/StoryDetail/StoryDetailPage';
import { PublishPage } from '../pages/Publish/PublishPage';
import { AIAssistantPage } from '../pages/AIAssistant/AIAssistantPage';
import { CrossAgePage } from '../pages/CrossAge/CrossAgePage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { LoginPage } from '../pages/Login/LoginPage';
import { storyDetailLoader } from './loaders';
import { storyDetailAction, publishAction } from './actions';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/story/:id',
    element: <StoryDetailPage />,
    loader: storyDetailLoader,
    action: storyDetailAction,
  },
  {
    path: '/publish',
    element: <PublishPage />,
    action: publishAction,
  },
  {
    path: '/ai',
    element: <AIAssistantPage />,
  },
  {
    path: '/cross-age',
    element: <CrossAgePage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
