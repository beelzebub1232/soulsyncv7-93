
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUp, Shield } from "lucide-react";

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
    if (!occupation.trim() || !documentUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both your occupation and identification document."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitProfessionalVerification(occupation, documentUrl);
      onClose();
    } catch (error) {
      console.error("Failed to submit verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-mindscape-primary" />
            Professional Verification
          </DialogTitle>
          <DialogDescription>
            Complete your professional verification to get a verified badge and contribute as a mental health professional.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md text-sm">
            <p>
              Professional accounts require verification by our admin team before gaining verified status. 
              Your information will only be used for verification purposes.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Professional Occupation</Label>
            <div className="relative">
              <Input
                id="occupation"
                placeholder="e.g. Clinical Psychologist, Therapist"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
              <Badge 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                variant="secondary"
              >
                Required
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document">Identification Document</Label>
            <div className="relative">
              <Input
                id="document"
                placeholder="URL to your professional license or certification"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
              />
              <Badge 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                variant="secondary"
              >
                Required
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Please provide a link to an image of your professional license, certification, or credentials.
            </p>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">
              For demo purposes, you can enter any valid URL for your document.
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
