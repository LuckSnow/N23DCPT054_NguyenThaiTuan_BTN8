export type FeedPost = {
  id: string;
  authorId: string;
  content: string;
  authorUsername: string;
  createdAt: string;
};

export type CurrentUser = {
  id: string;
  username: string;
};
