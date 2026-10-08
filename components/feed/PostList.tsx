import { PostCard } from "@/components/feed/PostCard";
import type { FeedPost } from "@/lib/types/feed";

type PostListProps = {
  posts: FeedPost[];
  currentUserId: string;
};

export function PostList({ posts, currentUserId }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">✦</span>
        <h2>Chưa có bài viết nào</h2>
        <p>Hãy là người đăng bài đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          canDelete={post.authorId === currentUserId}
        />
      ))}
    </div>
  );
}
