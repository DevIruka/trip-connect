import { useQuery } from '@tanstack/react-query';
import { getGPTTranslator } from './GPTTranslator';
import * as Sentry from '@sentry/nextjs';

// GPT 번역 로직을 위한 커스텀 훅
export const useGPTTranslation = (key: string, input: string) => {
  return useQuery({
    queryKey: [key], // 캐싱 키
    queryFn: async () => {
      try {
        const response = await getGPTTranslator(input);
        return response?.choices[0]?.message?.content || '';
      } catch (error) {
        Sentry.captureException(error);
      }
    },
    enabled: !!input, // input이 있을 때만 실행
    staleTime: 86000,
    // placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: true,
  });
};
