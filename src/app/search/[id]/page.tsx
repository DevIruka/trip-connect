import { useQuery } from '@tanstack/react-query';
import SearchResultComponent from '../_components/SearchResultComponent';
import { fetchUserProfile } from '@/utils/api/supabase_api/fetchUserProfile';
import { getUser } from '@/utils/api/supabase_api/getUser';

const SearchResultPage = async () => {
  const user = await getUser();
  console.log(user);
  return (
    <>
      <SearchResultComponent user={user} />
    </>
  );
};
export default SearchResultPage;
