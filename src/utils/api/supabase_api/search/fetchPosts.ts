import { supabase } from "@/utils/supabase/supabaseClient";
import { Dispatch, SetStateAction } from "react";

export const fetchPosts = async (
  { pageParam = 0, keyword }: { pageParam?: number; keyword: string | null },
  setCountReq: Dispatch<SetStateAction<number | null>>,
  setCountRes: Dispatch<SetStateAction<number | null>>,
  setNoResults: Dispatch<SetStateAction<boolean>>,
) => {
  const { data, error } = await supabase.rpc('search_and_sort_posts', {
    keyword,
    page_limit: 20, // 한 번에 불러올 데이터 개수
    page_offset: pageParam, // 현재 페이지 오프셋
  });

  if (error) throw new Error(error.message);
  
  if (data.totalcount === 0) {
    setNoResults(true);
  }

  setCountReq(data.requestcount);
  setCountRes(data.responsecount);

  return {
    posts: data?.data || [],
    nextOffset: data?.nextOffset, // 다음 페이지 오프셋
  };
};