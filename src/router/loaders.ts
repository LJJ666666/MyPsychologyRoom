import { LoaderFunctionArgs } from 'react-router-dom';
import { useStore } from '../store';

export async function storyDetailLoader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  const stories = useStore.getState().stories;
  const story = stories.find((s) => s.id === id) || null;
  return { story, id };
}

export async function homeLoader() {
  const state = useStore.getState();
  return { stories: state.stories };
}
