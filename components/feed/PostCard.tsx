import { DeletePostButton } from "@/components/forms/DeletePostButton";
import type { FeedPost } from "@/lib/types/feed";

type PostCardProps = {
  post: FeedPost;
  canDelete: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function PostCard({ post, canDelete }: PostCardProps) {
  return (
    <article className="post-card">
      <header className="post-meta">
        <span className="avatar-placeholder" aria-hidden="true">
          {post.authorUsername.charAt(0).toUpperCase()}
        </span>
        <div className="post-meta-copy">
          <h2>@{post.authorUsername}</h2>
          <time dateTime={post.createdAt}>{dateFormatter.format(new Date(post.createdAt))}</time>
        </div>
        {canDelete && <DeletePostButton postId={post.id} />}
      </header>
      <p className="post-content">{post.content}</p>
    </article>
  );
}
