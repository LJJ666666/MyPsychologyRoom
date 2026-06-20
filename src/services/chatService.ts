import { Message } from '../types';

/**
 * Chat Service — AI 对话服务层。
 *
 * 组件不应直接调用 LLM API，而应通过此服务层统一管理：
 *   - 双模式切换（mock / api）
 *   - Prompt 工程（角色设定、对话上下文、安全边界）
 *   - 流式响应（SSE / 模拟打字）
 *
 * 环境变量：
 *   VITE_LLM_MODE        mock | api            默认 mock
 *   VITE_LLM_API_URL    /api/v1/chat/completions  API 入口
 *   VITE_LLM_API_KEY    API Key（仅 api 模式需要）
 *   VITE_LLM_MODEL       模型名称（默认 gpt-4o-mini）
 */

// —— 类型定义 ——

export type LlmMode = 'mock' | 'api';

type LlmMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface ChatService {
  /**
   * 发送一条用户消息，获取 AI 回复。
   *
   * @param userInput 用户输入
   * @param history 历史对话（用于上下文）
   * @param onChunk 流式回调（每次收到新 chunk 时调用）
   * @returns 完整的 AI 回复文本
   */
  sendMessage(
    userInput: string,
    history: Message[],
    onChunk?: (partial: string) => void
  ): Promise<string>;
  /** 清空对话（由组件层调用 store.clearMessages 实际清空）。 */
  clearConversation(): void;
  /** 当前工作模式。 */
  getMode(): LlmMode;
}

// —— Prompt 工程 ——

const SYSTEM_PROMPT = `你是一个温暖、共情、专业的中文心理支持助手。你的任务是倾听来访者的倾诉，给予温暖的回应。

【角色设定】
- 你说话温和、亲切、有耐心，像一个值得信赖的朋友。
- 你理解来访者的感受，肯定他们的勇气，给予支持与温暖。

【回应原则】
1. 先倾听、共情，再引导。让来访者感受到被理解。
2. 不评判，不否定，不轻易下结论。
3. 用开放式问题引导来访者的成长。
4. 言语简短，语气温和。
5. 不做专业的诊断，只做支持性的回应。

【安全边界】
- 如果来访者提到自伤、自杀、伤害他人的倾向，你必须：
  （1）严肃表达关心和担忧
  （2）明确建议立即寻求专业帮助
  （3）提供资源：全国心理援助热线 400-161-9995（24小时）
- 不提供医疗建议。
- 不提供法律、财务等专业领域的建议。
- 遇到超出心理支持范围的问题，请建议寻求专业人士。

【对话风格】
- 每次回复控制在 100-200 字左右，保持简短，有温度。
- 用第一人称"我"，表达真诚。
- 用温和的语气，有具体的问题，开放式的提问。
`;

// 保留最近 10 条消息作为对话上下文
const HISTORY_WINDOW = 10;

function buildContextMessages(history: Message[]): LlmMessage[] {
  const recent = history.slice(-HISTORY_WINDOW);
  return recent.map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }));
}

// —— 安全边界检查 ——

const SELF_HARM_KEYWORDS = [
  '自杀', '不想活', '活着没意思', '结束生命', '自残', '伤害自己',
  '割腕', '跳楼', '不想活下去', '想不开',
];

function detectRisk(content: string): boolean {
  return SELF_HARM_KEYWORDS.some((keyword) => content.includes(keyword));
}

const SAFETY_RESPONSE =
  '我听到你说的这些，我非常非常担心你。\n\n请你一定相信，无论现在多么痛苦，事情一定会有转机的。\n\n你不是一个人，有很多人愿意帮助你。请立即拨打【全国心理援助热线：400-161-9995（24小时）】，或尽快联系专业的心理咨询师、精神科医生。\n\n你值得被好好对待。';

// —— Mock 模式实现 ——

const MOCK_RESPONSES: Record<string, string[]> = {
  greeting: [
    '谢谢你愿意和我分享。能告诉我更多吗？是什么让你今天想聊聊？',
    '你好，感谢你信任我。我在这里陪着你，慢慢说。',
  ],
  comfort: [
    '我能感受到你现在的困扰……听起来你经历了很多不容易的事情。能再多说说吗？',
    '谢谢你的分享。这种感受真的很不容易，我理解你的心情。',
    '你能把这些说出来，已经很勇敢了。我在这里陪着你。',
  ],
  empathy: [
    '我理解你的感受。很多人都有过类似的经历，你不是一个人。',
    '这种感觉一定很煎熬。能和你分享这些，需要很大的勇气。',
    '你说得很真实。每个人都会有脆弱的时候，这很正常。',
  ],
  questions: [
    '你想过为什么会这样想吗？有没有什么时候感觉会好一点？',
    '除了这些让你困扰的事情，最近有没有什么让你感到开心的小事？',
    '如果抛开所有的担忧，你理想中的生活是什么样的？',
  ],
  encouragement: [
    '你能意识到这些问题，已经是很好的开始了。改变需要时间，慢慢来。',
    '你很坚强，能够面对这些并且愿意说出来。相信自己，你有力量度过难关。',
    '每一天都是新的开始。即使现在很难，也请相信事情会有转机的。',
  ],
  work: [
    '工作压力确实让人很累。能告诉我具体是什么让你最困扰的吗？',
    '职场的压力我能理解。有时候适当的休息和调整也很重要。',
  ],
  family: [
    '家庭关系总是很复杂的。能多说说具体发生了什么吗？',
    '和家人的矛盾，我能理解你的感受。',
  ],
  default: [
    '谢谢你和我分享。能再多告诉我一些吗？',
    '我听到了。能多说说你的感受吗？',
    '你说的这些让我很在意。能再详细讲讲吗？',
  ],
};

function pickMockResponse(input: string): string {
  if (/工作|加班|老板|同事|公司|上班|职场/.test(input)) {
    return MOCK_RESPONSES.work[Math.floor(Math.random() * MOCK_RESPONSES.work.length)];
  }
  if (/爸爸|妈妈|父母|家人|家庭|孩子|儿子|女儿/.test(input)) {
    return MOCK_RESPONSES.family[Math.floor(Math.random() * MOCK_RESPONSES.family.length)];
  }
  if (/你好|嗨|哈喽|在吗/.test(input)) {
    return MOCK_RESPONSES.greeting[Math.floor(Math.random() * MOCK_RESPONSES.greeting.length)];
  }
  if (/难过|伤心|痛苦|想哭|崩溃|绝望|失望|不开心/.test(input)) {
    return MOCK_RESPONSES.comfort[Math.floor(Math.random() * MOCK_RESPONSES.comfort.length)];
  }
  if (/迷茫|不知道|怎么办|该怎么办/.test(input)) {
    return MOCK_RESPONSES.empathy[Math.floor(Math.random() * MOCK_RESPONSES.empathy.length)];
  }
  if (/加油|鼓励|支持/.test(input)) {
    return MOCK_RESPONSES.encouragement[Math.floor(Math.random() * MOCK_RESPONSES.encouragement.length)];
  }
  const defaultRes = MOCK_RESPONSES.default;
  return defaultRes[Math.floor(Math.random() * defaultRes.length)];
}

/** 模拟打字效果：逐字符输出。 */
async function typeWriter(
  text: string,
  onChunk: (partial: string) => void
): Promise<string> {
  let full = '';
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 30 + 15));
    full += chars[i];
    onChunk(full);
  }
  return text;
}

// —— API 模式实现 ——

interface ApiConfig {
  url: string;
  apiKey: string;
  model: string;
}

function getApiConfig(): ApiConfig {
  const env = (import.meta as { env?: Record<string, string> }).env || {};
  return {
    url: env.VITE_LLM_API_URL || '/api/v1/chat/completions',
    apiKey: env.VITE_LLM_API_KEY || '',
    model: env.VITE_LLM_MODEL || 'gpt-4o-mini',
  };
}

/** 调用真实 LLM API（OpenAI 兼容格式）。 */
async function callLlmApi(
  messages: LlmMessage[],
  onChunk: (partial: string) => void,
  config: ApiConfig
): Promise<string> {
  const { url, apiKey, model } = config;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API 请求失败 (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error('LLM API 不支持流式响应');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          onChunk(fullText);
        }
      } catch {
        // 忽略解析错误
      }
    }
  }

  return fullText;
}

// —— Service 实现 ——

/** 创建 chatService。根据环境变量自动选择模式。 */
export function useChatService(): ChatService {
  const envForMode = (import.meta as { env?: Record<string, string> }).env || {};
  const mode: LlmMode = envForMode.VITE_LLM_MODE === 'api' ? 'api' : 'mock';

  const sendMessage: ChatService['sendMessage'] = async (userInput, history, onChunk) => {
    // 安全检查：自伤/他伤倾向
    if (detectRisk(userInput)) {
      const safety = SAFETY_RESPONSE;
      if (onChunk) {
        return typeWriter(safety, onChunk);
      }
      return safety;
    }

    const contextMessages = buildContextMessages(history);
    const messages: LlmMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...contextMessages,
      { role: 'user', content: userInput },
    ];

    if (mode === 'mock') {
      const response = pickMockResponse(userInput);
      if (onChunk) {
        return typeWriter(response, onChunk);
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(response), 1000);
      });
    }

    // API 模式
    try {
      const config = getApiConfig();
      const fullText = await callLlmApi(messages, onChunk || (() => {}), config);
      return fullText;
    } catch (error) {
      console.error('LLM API 调用失败:', error);
      const fallback = '抱歉，我现在有点忙，暂时无法回应。请稍后再试，或拨打【全国心理援助热线：400-161-9995】。';
      if (onChunk) {
        return typeWriter(fallback, onChunk);
      }
      return fallback;
    }
  };

  const clearConversation: ChatService['clearConversation'] = () => {
    // 实际清空由组件层调用 store.clearMessages 实现
    // 这里保留接口以保持服务层一致性
  };

  const getMode: ChatService['getMode'] = () => mode;

  return { sendMessage, clearConversation, getMode };
}
