import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/components/forms/CreatePostForm";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { PostList } from "@/components/feed/PostList";
import { getCurrentUser } from "@/lib/auth/session";
import { getFeedPosts } from "@/lib/data/posts";

export const metadata: Metadata = { title: "Bảng tin" };

export default async function FeedPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const posts = await getFeedPosts();

  return (
    <main className="feed-shell">
      <FeedHeader currentUser={currentUser} />
      <div className="feed-content">
        <CreatePostForm />
        <section className="post-section" aria-labelledby="post-list-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Cộng đồng</p>
              <h1 id="post-list-title">Bài viết mới nhất</h1>
            </div>
            <span className="post-total" aria-label={`${posts.length} bài viết`}>
              {posts.length} bài viết
            </span>
          </div>
          <PostList posts={posts} currentUserId={currentUser.id} />
        </section>
      </div>
    </main>
  );
}
