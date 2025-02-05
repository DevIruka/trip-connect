import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getGPTTranslator = async (text: string, nation?: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `언어를 감지해서 사용자의 언어가 아니면, 사용자의 언어로 번역해주세요. 사용자 언어: ${
              nation ? nation : '한국'
            }어(두바이, 싱가포르는 영어)\nhtml 문법상 텍스트만 번역해주세요. 나머지는 그대로 되돌려주세요. 만일 html 태그가 없다면, <p></p>태그로 감싸서 되돌려주세요. \n아래의 JSON 형식으로\n---\n{\n  "original": <p>hi</p>,\n "translated": <p>안녕</p>\n}`,
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text,
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response;
};
