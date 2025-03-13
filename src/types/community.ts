
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
  authorRole: 'user' | 'professional' | 'admin';
  date: Date;
  replies: number;
  likes: number;
  isAnonymous: boolean;
  isReported: boolean;
  reportReason?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: 'user' | 'professional' | 'admin';
  date: Date;
  isAnonymous: boolean;
  likes: number;
  isReported: boolean;
  reportReason?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export interface ProfessionalVerificationRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  occupation: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: Date;
  reviewDate?: Date;
  reviewedBy?: string;
}

export interface ReportedContent {
  id: string;
  contentId: string;
  contentType: 'post' | 'reply';
  reporterId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
  reviewDate?: Date;
  reviewedBy?: string;
}
