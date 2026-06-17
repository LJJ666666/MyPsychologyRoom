import { Story, CrossAgeTopic, Comment } from '../types';

const anonymousAvatars = [
  '🌱', '🌸', '🌻', '🌺', '🌷', '🍀', '🌿', '🪻',
  '🦋', '🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🐯',
];

const getRandomAvatar = () => anonymousAvatars[Math.floor(Math.random() * anonymousAvatars.length)];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    content: '我理解你的感受，我也经历过类似的困惑。',
    author: { nickname: '路过的心声', ageGroup: 'worker' },
    createdAt: '2小时前',
    likes: 12,
  },
  {
    id: 'c2',
    content: '抱抱你，一切都会好起来的。',
    author: { nickname: '温暖的光', ageGroup: 'parent' },
    createdAt: '3小时前',
    likes: 8,
  },
  {
    id: 'c3',
    content: '我也曾经这样想过，但后来发现...',
    author: { nickname: '时间的答案', ageGroup: 'elder' },
    createdAt: '5小时前',
    likes: 5,
  },
];

export const mockStories: Story[] = [
  {
    id: '1',
    title: '18岁的我，真的很讨厌妈妈的唠叨',
    content: `妈妈每天都要问我学习怎么样，考试考了多少分，有没有复习。我知道她是关心我，但每次听到这些话，我心里就很烦躁。

有时候我在想，她是不是不相信我能处理好自己的事情？为什么总是要一遍遍地提醒我这个没做、那个没做？

但有时候看到她忙碌的身影，又会觉得自己很不应该...我真的不知道该怎么和她相处了。`,
    type: 'vent',
    tags: ['亲子关系', '青春期', '困惑'],
    author: {
      nickname: '迷茫的少年',
      ageGroup: 'teen',
      avatar: getRandomAvatar(),
    },
    createdAt: '2小时前',
    likes: 128,
    comments: [
      {
        id: 'c1-1',
        content: '我懂你的感受，我以前也是这样。但后来我试着和妈妈好好谈了谈，发现她只是不知道该怎么表达担心。',
        author: { nickname: '过来人', ageGroup: 'worker' },
        createdAt: '1小时前',
        likes: 45,
      },
      {
        id: 'c1-2',
        content: '妈妈唠叨的背后，其实是不安的内心。试着理解她吧，你们需要的只是好好沟通。',
        author: { nickname: '心理咨询师小林', ageGroup: 'worker' },
        createdAt: '45分钟前',
        likes: 32,
      },
    ],
    isLiked: false,
    isCollected: false,
  },
  {
    id: '2',
    title: '作为新手妈妈，我有时候真的很崩溃',
    content: `宝宝刚满两岁，正是terrible two的阶段。每天从早到晚都在喊"不要不要"，喂饭不吃、穿衣不穿、出门要抱...

我已经很努力在做一个好妈妈了，但有时候真的会忍不住对孩子发火。发完火又特别后悔，觉得自己不是个好妈妈。

特别是夜里宝宝哭闹的时候，一个人哄着哄着就想哭。老公工作忙也帮不上太多忙，感觉好孤独。`,
    type: 'vent',
    tags: ['育儿', '新手妈妈', '情绪管理'],
    author: {
      nickname: '小星妈妈',
      ageGroup: 'parent',
      avatar: getRandomAvatar(),
    },
    createdAt: '4小时前',
    likes: 256,
    comments: [
      {
        id: 'c2-1',
        content: '妈妈，你已经很棒了！照顾好自己才能照顾好宝宝，偶尔情绪失控是正常的，不要太自责。',
        author: { nickname: '理解的心', ageGroup: 'worker' },
        createdAt: '3小时前',
        likes: 67,
      },
    ],
    isLiked: true,
    isCollected: true,
  },
  {
    id: '3',
    title: '35岁职场人：为什么我总觉得不够好？',
    content: `最近公司来了很多名校毕业的年轻人，他们聪明、勤奋、有想法。看着他们，我觉得自己好像停滞了。

明明已经很努力了，但还是会焦虑。每天加班到很晚，周末也要处理工作。家人说我太拼了，但我不拼命怎么行？

有时候半夜醒来，会突然不知道自己到底在追求什么。这种感觉好迷茫。`,
    type: 'help',
    tags: ['职场', '中年危机', '自我怀疑'],
    author: {
      nickname: '奔跑的阿甘',
      ageGroup: 'worker',
      avatar: getRandomAvatar(),
    },
    createdAt: '6小时前',
    likes: 189,
    comments: [],
    isLiked: false,
    isCollected: false,
  },
  {
    id: '4',
    title: '60岁的我，学会了和女儿和解',
    content: `年轻的时候，我觉得自己做妈妈很成功。女儿从小听话乖巧，学习也好。

但她大学毕业去了大城市工作后，我发现我们的距离越来越远。她说的话我听不懂，她的想法我也不理解。

后来有一次她回家，我们大吵了一架。那次吵架让我意识到，也许我一直以来的"为你好"，并不是她需要的。

现在我学会了闭嘴，学会倾听。虽然还是不太懂她的世界，但我至少不会再把自己的想法强加给她了。`,
    type: 'share',
    tags: ['代际关系', '成长感悟', '和解'],
    author: {
      nickname: '云淡风轻',
      ageGroup: 'elder',
      avatar: getRandomAvatar(),
    },
    createdAt: '1天前',
    likes: 412,
    comments: [
      {
        id: 'c4-1',
        content: '阿姨，您能意识到这一点真的很了不起。很多父母一辈子都做不到这种改变。',
        author: { nickname: '感恩的心', ageGroup: 'teen' },
        createdAt: '20小时前',
        likes: 89,
      },
      {
        id: 'c4-2',
        content: '看得我眼眶湿润...希望我的妈妈也能像您一样理解我。',
        author: { nickname: '渴望理解', ageGroup: 'teen' },
        createdAt: '18小时前',
        likes: 56,
      },
    ],
    isLiked: false,
    isCollected: true,
  },
  {
    id: '5',
    title: '高中生的独白：我不喜欢现在的自己',
    content: `上了高中以后，我好像变了一个人。以前开朗活泼的我，现在变得不爱说话了。

成绩在班级中等，但我不想努力。不是不想，是觉得努力了也没有用。

回到家就把自己关在房间里，刷手机到半夜。我知道这样不对，但就是提不起劲来。

爸妈觉得我只是贪玩，老师觉得我缺乏上进心。只有我自己知道，我是真的不知道为什么要这样活着。`,
    type: 'help',
    tags: ['青春期', '迷茫', '自我认同'],
    author: {
      nickname: '沉默的星星',
      ageGroup: 'teen',
      avatar: getRandomAvatar(),
    },
    createdAt: '8小时前',
    likes: 321,
    comments: [
      {
        id: 'c5-1',
        content: '谢谢你的坦诚。很多人都有过这样的阶段，你不是一个人。愿意说出这些，说明你想要改变。',
        author: { nickname: '倾听者', ageGroup: 'parent' },
        createdAt: '7小时前',
        likes: 78,
      },
    ],
    isLiked: false,
    isCollected: false,
  },
  {
    id: '6',
    title: '单亲爸爸的日常：既当爹又当妈',
    content: `离婚三年了，一个人带着8岁的儿子生活。

白天要上班，晚上要做饭、辅导作业、陪孩子玩。周末还要带孩子去上兴趣班。

有时候真的很累，但看到孩子天真的笑容，又觉得一切都值得。

最难的是孩子问起妈妈的时候，我不知道该怎么回答。`,
    type: 'share',
    tags: ['单亲家庭', '育儿', '生活感悟'],
    author: {
      nickname: '坚强的父爱',
      ageGroup: 'worker',
      avatar: getRandomAvatar(),
    },
    createdAt: '12小时前',
    likes: 267,
    comments: [],
    isLiked: true,
    isCollected: false,
  },
];

export const crossAgeTopics: CrossAgeTopic[] = [
  {
    id: 'topic1',
    title: '父母唠叨背后的真实想法',
    description: '当我们觉得父母很烦的时候，他们到底在想什么？',
    perspectives: [
      {
        ageGroup: 'teen',
        ageGroupLabel: '青少年',
        content: '每次我妈唠叨，我就想把耳朵关起来。她说的那些我都知道，为什么还要一遍遍说？真的很烦。',
        authorName: '小明',
      },
      {
        ageGroup: 'worker',
        ageGroupLabel: '职场人',
        content: '现在自己也成了父母，终于理解妈妈当年的唠叨了。其实每次开口之前也很纠结，但就是忍不住担心。',
        authorName: '职场妈妈小李',
      },
      {
        ageGroup: 'parent',
        ageGroupLabel: '父母',
        content: '我知道孩子嫌我烦，但每次看到新闻里出事的少年，我就忍不住想提醒他。社会太复杂了，我真的好怕他吃亏。',
        authorName: '焦虑的母亲',
      },
      {
        ageGroup: 'elder',
        ageGroupLabel: '中老年',
        content: '回头看，养孩子就是一个不断放手的過程。唠叨是因为爱，但孩子总要自己飞翔。给他们信任，也是给自己解脱。',
        authorName: '退休教师王阿姨',
      },
    ],
  },
  {
    id: 'topic2',
    title: '职场竞争中的年龄焦虑',
    description: '年轻人涌入职场，中年人该如何自处？',
    perspectives: [
      {
        ageGroup: 'teen',
        ageGroupLabel: '青少年',
        content: '虽然我还在读书，但已经能感受到学历焦虑了。名校越来越难考，未来好像竞争只会更激烈。',
        authorName: '高三学生小王',
      },
      {
        ageGroup: 'worker',
        ageGroupLabel: '职场人',
        content: '35岁真的是道坎。公司里年轻人又便宜又有干劲，我开始怀疑自己的价值在哪里。必须不停地学习新技能。',
        authorName: '互联网从业者',
      },
      {
        ageGroup: 'parent',
        ageGroupLabel: '父母',
        content: '看着孩子每天加班到半夜，心疼但也没办法。社会就是这样，只能希望他们不要太累，身体最重要。',
        authorName: '操心爸妈',
      },
      {
        ageGroup: 'elder',
        ageGroupLabel: '中老年',
        content: '年轻时有冲劲是好的，但也要注意身体。我见过太多年轻时拼命老了身体垮了的例子。工作是马拉松，不是百米冲刺。',
        authorName: '退休干部老张',
      },
    ],
  },
  {
    id: 'topic3',
    title: '代际沟通的困境与突破',
    description: '为什么和父母/孩子说话越来越难？',
    perspectives: [
      {
        ageGroup: 'teen',
        ageGroupLabel: '青少年',
        content: '和爸妈说话感觉有代沟。他们不懂我的世界，我也懒得解释。干脆就不说了。',
        authorName: '初中生小刘',
      },
      {
        ageGroup: 'worker',
        ageGroupLabel: '职场人',
        content: '每次回家，爸妈问的就是结婚、工作。我不想按他们的方式活，但也不想让他们失望。很矛盾。',
        authorName: '沪漂青年',
      },
      {
        ageGroup: 'parent',
        ageGroupLabel: '父母',
        content: '孩子越大越不爱说话了。想关心他，但一开口就是"吃了没""学习怎么样"，孩子就不耐烦了。我也不知道该怎么和他交流。',
        authorName: '困惑的父亲',
      },
      {
        ageGroup: 'elder',
        ageGroupLabel: '中老年',
        content: '时代不同了，不能拿老一套要求年轻人。但有时候真的看不懂他们的想法。沟通需要双方都愿意，光一方努力是不够的。',
        authorName: '开明的老人',
      },
    ],
  },
];

export const aiResponses: Record<string, string[]> = {
  greeting: [
    '你好，感谢你愿意和我分享。我是你的AI心理助手，会在这里倾听你的声音。',
    '欢迎来到这里。我是AI心理助手，很高兴你能信任我，愿意说说你的事情。',
  ],
  comfort: [
    '我能感受到你现在的困扰...你能再多说说吗？',
    '听起来你经历了很多不容易的事情。我在这里陪着你，慢慢说。',
    '谢谢你的分享。这种感受真的很不容易，我理解你的心情。',
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
  closing: [
    '今天聊了很多，我很高兴你愿意分享。记得，你不是一个人。如果以后想说，我随时都在。',
    '谢谢你今天的信任。希望我的话能给你一些温暖。记得照顾好自己。',
  ],
};

export const getAIResponse = (keyword: string): string => {
  const keys = Object.keys(aiResponses);
  const matchedKey = keys.find(key => keyword.includes(key)) || 'comfort';
  const responses = aiResponses[matchedKey];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const popularTags = [
  '亲子关系',
  '职场压力',
  '情感困惑',
  '自我成长',
  '人际交往',
  '原生家庭',
  '婚姻恋爱',
  '焦虑抑郁',
  '学业压力',
  '中年危机',
];
