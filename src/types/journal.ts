
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string format
  mood?: string;
  tags?: string[];
  attachments?: Array<{
    type: 'image' | 'audio' | 'link';
    url: string;
    name?: string;
  }>;
  favorite?: boolean;
}
