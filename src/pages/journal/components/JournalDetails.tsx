
import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { JournalEntry } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Tag, Paperclip, Link2, Camera, Mic } from "lucide-react";
import { formatRelative } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface JournalDetailsProps {
  entry: JournalEntry;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function JournalDetails({ 
  entry, 
  isOpen, 
  onClose,
  onToggleFavorite
}: JournalDetailsProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mediaPreview, setMediaPreview] = useState<{
    type: 'image' | 'audio';
    url: string;
    name?: string;
  } | null>(null);
  
  // Check screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Format content with markdown-like syntax
  const formatContent = (content: string) => {
    // Handle bold text
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic text
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle list items
    formattedContent = formattedContent.replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>');
    formattedContent = formattedContent.replace(/<li>.*?<\/li>/g, match => {
      return `<ul class="list-disc pl-5 my-2">${match}</ul>`;
    });
    
    // Handle line breaks
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  };
  
  const openMediaPreview = (attachment: {
    type: 'image' | 'audio';
    url: string;
    name?: string;
  }) => {
    if (attachment.type === 'image' || attachment.type === 'audio') {
      setMediaPreview(attachment);
    }
  };
  
  const closeMediaPreview = () => {
    setMediaPreview(null);
  };
  
  const renderAttachments = () => {
    if (!entry.attachments || entry.attachments.length === 0) return null;
    
    return (
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Paperclip className="h-3.5 w-3.5" />
          Attachments
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entry.attachments.map((attachment, index) => {
            if (attachment.type === 'image') {
              return (
                <div 
                  key={`img-${index}`}
                  className="relative border border-border rounded-md overflow-hidden bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors group"
                  onClick={() => openMediaPreview(attachment)}
                >
                  <div className="aspect-video relative">
                    <img 
                      src={attachment.url} 
                      alt={attachment.name || 'Image attachment'} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs truncate">{attachment.name || 'Image'}</span>
                  </div>
                </div>
              );
            } else if (attachment.type === 'audio') {
              return (
                <div 
                  key={`audio-${index}`}
                  className="border border-border rounded-md overflow-hidden bg-muted/50 p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-mindscape-primary" />
                    <span className="text-sm font-medium truncate">{attachment.name || 'Audio'}</span>
                  </div>
                  <audio 
                    controls 
                    src={attachment.url} 
                    className="w-full h-8"
                  />
                </div>
              );
            } else if (attachment.type === 'link') {
              return (
                <a 
                  key={`link-${index}`}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border rounded-md overflow-hidden bg-muted/50 p-3 flex items-center gap-3 hover:bg-muted/80 transition-colors"
                >
                  <Link2 className="h-4 w-4 text-mindscape-primary" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate block">
                      {attachment.name || 'Link'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate block">
                      {attachment.url}
                    </span>
                  </div>
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };
  
  // Use Sheet for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6 overflow-y-auto">
            <SheetHeader className="text-left">
              <div className="flex justify-between items-start">
                <SheetTitle className="text-xl pr-8">{entry.title}</SheetTitle>
                <button 
                  onClick={() => onToggleFavorite(entry.id)}
                  className="p-1.5 rounded-full hover:bg-mindscape-light/70 transition-colors"
                  aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={cn(
                      "h-5 w-5 transition-colors", 
                      entry.favorite ? "fill-red-400 text-red-400" : "text-muted-foreground"
                    )} 
                  />
                </button>
              </div>
              <SheetDescription className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelative(new Date(entry.date), new Date())}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 animate-fade-in">
              <div 
                className="prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: formatContent(entry.content) }}
              />
              
              {(entry.mood || (entry.tags && entry.tags.length > 0)) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {entry.mood && (
                    <div className="bg-mindscape-primary/10 text-mindscape-primary rounded-full px-3 py-1 text-xs">
                      {entry.mood}
                    </div>
                  )}
                  
                  {entry.tags && entry.tags.map(tag => (
                    <div 
                      key={tag}
                      className="bg-mindscape-light text-mindscape-primary rounded-full px-3 py-1 text-xs flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              
              {renderAttachments()}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Media Preview Dialog */}
        {mediaPreview && (
          <Dialog open={!!mediaPreview} onOpenChange={closeMediaPreview}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{mediaPreview.name || 'Preview'}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                {mediaPreview.type === 'image' && (
                  <img 
                    src={mediaPreview.url} 
                    alt={mediaPreview.name || 'Image preview'} 
                    className="w-full h-auto rounded-md"
                  />
                )}
                
                {mediaPreview.type === 'audio' && (
                  <audio 
                    controls 
                    src={mediaPreview.url} 
                    className="w-full"
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
  
  // Desktop version
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl">{entry.title}</DialogTitle>
              <button 
                onClick={() => onToggleFavorite(entry.id)}
                className="p-1.5 rounded-full hover:bg-mindscape-light/70 transition-colors"
                aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5 transition-colors", 
                    entry.favorite ? "fill-red-400 text-red-400" : "text-muted-foreground"
                  )} 
                />
              </button>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelative(new Date(entry.date), new Date())}
            </div>
          </DialogHeader>
          
          <div className="mt-6 animate-fade-in">
            <div 
              className="prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: formatContent(entry.content) }}
            />
            
            {(entry.mood || (entry.tags && entry.tags.length > 0)) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {entry.mood && (
                  <div className="bg-mindscape-primary/10 text-mindscape-primary rounded-full px-3 py-1 text-xs">
                    {entry.mood}
                  </div>
                )}
                
                {entry.tags && entry.tags.map(tag => (
                  <div 
                    key={tag}
                    className="bg-mindscape-light text-mindscape-primary rounded-full px-3 py-1 text-xs flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
            
            {renderAttachments()}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Media Preview Dialog */}
      {mediaPreview && (
        <Dialog open={!!mediaPreview} onOpenChange={closeMediaPreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{mediaPreview.name || 'Preview'}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {mediaPreview.type === 'image' && (
                <img 
                  src={mediaPreview.url} 
                  alt={mediaPreview.name || 'Image preview'} 
                  className="w-full h-auto rounded-md"
                />
              )}
              
              {mediaPreview.type === 'audio' && (
                <audio 
                  controls 
                  src={mediaPreview.url} 
                  className="w-full"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
