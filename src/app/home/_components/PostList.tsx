import ListReqPost from '@/components/ListReqPost';
import { Post } from '../_types/homeTypes';
import ListResPost from '@/components/ListResPost';

type PostListProps = {
  posts: Post[];
};

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <ul className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-start md:gap-4 md:justify-center md:px-9">
      {posts.map((post) =>
        !post.request_id ? (
          <ListReqPost key={post.id} post={post} />
        ) : (
          <ListResPost key={post.id} post={post} />
        ),
      )}
    </ul>
  );
};

export default PostList;
