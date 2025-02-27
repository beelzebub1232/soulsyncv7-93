
export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  color: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  author: string;
  date: Date;
  replies: number;
  isAnonymous: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  date: Date;
  isAnonymous: boolean;
  likes: number;
}
