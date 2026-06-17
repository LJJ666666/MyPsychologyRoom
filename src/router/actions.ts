import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { useStore } from '../store';

export async function storyDetailAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  const storyId = params.id || '';

  if (intent === 'like') {
    useStore.getState().likeStory(storyId);
    return null;
  }
  if (intent === 'collect') {
    useStore.getState().collectStory(storyId);
    return null;
  }
  if (intent === 'comment') {
    const content = String(formData.get('content') || '').trim();
    if (content) {
      const user = useStore.getState().user;
      useStore.getState().addComment(storyId, {
        author: {
          nickname: user?.nickname || '匿名用户',
          ageGroup: user?.ageGroup || 'worker',
          avatar: '',
        },
        content,
      });
    }
    return null;
  }
  return null;
}

export async function publishAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const type = (String(formData.get('type') || 'share') as 'share' | 'vent' | 'help');
  const tagsRaw = String(formData.get('tags') || '').trim();
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  if (!title || !content) {
    return { error: '标题和内容不能为空' };
  }

  const user = useStore.getState().user;
  const newStory = {
    title,
    content,
    type,
    tags,
    author: {
      nickname: user?.nickname || '匿名用户',
      ageGroup: user?.ageGroup || 'worker',
      avatar: '',
    },
  };

  useStore.getState().addStory(newStory);

  // Store.addStory 内部会自动生成 id、createdAt 等，但我们无法获取它
  // 这里简单重定向到首页，新故事会出现在列表最前面
  return redirect('/');
}
