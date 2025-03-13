
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
  authorId: string;
  authorRole: string;
  date: Date;
  replies: number;
  isAnonymous: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: string;
  date: Date;
  isAnonymous: boolean;
  likes: number;
}

export interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'reply';
  reportedBy: string;
  reason: string;
  date: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}
