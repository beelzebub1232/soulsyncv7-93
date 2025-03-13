
export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  color: string;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  likes: number;
  replies: number;
  isLiked?: boolean;
}

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'reply';
  reportedBy: string;
  reason: string;
  date: Date;
  status: ReportStatus;
}
