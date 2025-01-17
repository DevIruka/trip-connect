import { useQuery } from '@tanstack/react-query';
import { GPTTranslator } from '../GPTTranslator';

// GPT 번역 로직을 위한 커스텀 훅
export const useGPTTranslation = (key: string, input: string) => {
  return useQuery({
    queryKey: [key], // 캐싱 키
    queryFn: async () => {
      const response = await GPTTranslator(input);
      return response?.choices[0]?.message?.content || '';
    },
    enabled: !!input, // input이 있을 때만 실행
    staleTime: 86000,
    // placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
