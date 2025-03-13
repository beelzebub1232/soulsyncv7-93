
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
  likes: number;
  images?: string[];
  videoLinks?: string[];
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
  parentReplyId?: string;
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

export interface ProfessionalVerification {
  id: string;
  userId: string;
  name: string;
  occupation: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
  reviewedDate?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'like' | 'report' | 'verification';
  content: string;
  relatedId: string;
  date: Date;
  read: boolean;
}
