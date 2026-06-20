import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import { StoryDetailPage } from '../pages/StoryDetail/StoryDetailPage';
import { PublishPage } from '../pages/Publish/PublishPage';
import { AIAssistantPage } from '../pages/AIAssistant/AIAssistantPage';
import { CrossAgePage } from '../pages/CrossAge/CrossAgePage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { LoginPage } from '../pages/Login/LoginPage';
import MyStoriesPage from '../pages/MyStories/MyStoriesPage';
import MyCollectionsPage from '../pages/MyCollections/MyCollectionsPage';
import EditProfilePage from '../pages/EditProfile/EditProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/story/:id',
    element: <StoryDetailPage />,
  },
  {
    path: '/publish',
    element: <PublishPage />,
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
    path: '/profile/stories',
    element: <MyStoriesPage />,
  },
  {
    path: '/profile/collections',
    element: <MyCollectionsPage />,
  },
  {
    path: '/profile/edit',
    element: <EditProfilePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
