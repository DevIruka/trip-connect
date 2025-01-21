import { useQuery } from '@tanstack/react-query';
import { GPTTranslator } from './GPTTranslator';

const useTranslate = (text: string) => {
  return useQuery({
    queryKey: ['translate', text],
    queryFn: async () => {
      const response = await GPTTranslator(text);
      return response?.choices[0]?.message?.content || '';
    },
    enabled: !!text, // 텍스트가 존재할 때만 실행
    staleTime: 86000,
  });
};

export default useTranslate;
