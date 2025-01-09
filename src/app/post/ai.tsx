import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const UseTranslate = async (text: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: '언어를 감지해서 사용자의 언어로 번역해주세요. 아래와 같은 json 형식으로\n---\n{\n"원문":"blah",\n"번역문":"블라",\n}\n',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `사용자 언어: 한국어\n${text}`,
          },
        ],
      },
    ],
    response_format: {
      type: 'text',
    },
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response;
};

export default UseTranslate;
