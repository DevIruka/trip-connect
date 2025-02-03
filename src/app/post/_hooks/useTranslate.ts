import { useQuery } from '@tanstack/react-query';
import { getGPTTranslator } from './getGPTTranslator';

const useTranslate = (text: string) => {
  return useQuery({
    queryKey: ['translate', text],
    queryFn: async () => {
      const response = await getGPTTranslator(text);
      return response?.choices[0]?.message?.content || '';
    },
    enabled: !!text, // 텍스트가 존재할 때만 실행
    staleTime: 86000,
  });
};

export default useTranslate;
