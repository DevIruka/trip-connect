import { getUser } from './getUser';

export const fetchUserProfile = async () => {
  const data = await getUser();
  return data; // 인증된 유저의 프로필 반환
};
