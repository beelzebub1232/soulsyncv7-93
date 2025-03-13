
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Upload } from "lucide-react";

interface ProfessionalVerificationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfessionalVerificationForm({ isOpen, onClose }: ProfessionalVerificationFormProps) {
  const { user, submitProfessionalVerification } = useUser();
  const { toast } = useToast();
  
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [documentUrl, setDocumentUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!occupation.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter your occupation."
      });
      return;
    }
    
    if (!documentUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a document URL for verification."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitProfessionalVerification(occupation, documentUrl);
      onClose();
      toast({
        title: "Verification submitted",
        description: "Your professional verification request has been submitted for review."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span>Professional Verification</span>
          </DialogTitle>
          <DialogDescription>
            Complete your professional profile to get verified. Your credentials will be reviewed by our admin team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="occupation">Professional Occupation</Label>
            <Input
              id="occupation"
              placeholder="e.g., Licensed Therapist, Psychologist"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Please specify your occupation and qualifications
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document">Verification Document</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="document"
                placeholder="URL to your license/certificate"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="shrink-0"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Provide a link to your professional license, certification, or other relevant document
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
            <p className="text-sm">
              After submission, your request will be reviewed by our admin team. Once approved, you'll receive a verified badge on your posts and can contribute as a professional.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="button-primary"
          >
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
