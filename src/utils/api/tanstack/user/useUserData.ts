import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../supabase_api/user/fetchUser';
import { UserData } from '@/app/[locale]/user/_types/user';

const useUserData = (
  id: string,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>,
) => {
  const { data, isPending: isUserPending } = useQuery({
    queryKey: ['otherUser', id],
    queryFn: async () => {
      const response = await fetchUser(id);
      setUserData(response!);
      return response;
    },
  });
  return { data, isUserPending };
};

export default useUserData;
