
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
  tags?: string[];
  attachments?: Array<{
    type: 'image' | 'audio' | 'link';
    url: string;
    name?: string;
  }>;
  favorite?: boolean;
}
