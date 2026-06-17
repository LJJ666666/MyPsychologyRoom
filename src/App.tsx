import { useState } from 'react';
import HomePage from './pages/Home/HomePage';
import { StoryDetailPage } from './pages/StoryDetail';
import { PublishPage } from './pages/Publish';

type PageType = 'main' | 'detail' | 'publish';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleStoryClick = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentPage('detail');
  };

  const handlePublish = () => {
    setCurrentPage('publish');
  };

  const handleBack = () => {
    setCurrentPage('main');
    setSelectedStoryId(null);
  };

  const handlePublishSuccess = () => {
    setCurrentPage('main');
  };

  if (currentPage === 'detail' && selectedStoryId) {
    return <StoryDetailPage storyId={selectedStoryId} onBack={handleBack} />;
  }

  if (currentPage === 'publish') {
    return <PublishPage onBack={handleBack} onSuccess={handlePublishSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HomePage onStoryClick={handleStoryClick} onPublish={handlePublish} />
    </div>
  );
}
