
import { useState } from "react";
import { 
  Heart, 
  Phone, 
  MessageSquare, 
  Info, 
  Plus, 
  X, 
  User, 
  Save
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export function CrisisHelpSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Crisis Text Line",
      phone: "741741",
      relationship: "Support Service"
    }
  ]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and phone number.",
        variant: "destructive"
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship
    };

    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: "", phone: "", relationship: "" });
    setAddContactDialogOpen(false);

    toast({
      title: "Contact added",
      description: `${contact.name} has been added to your emergency contacts.`
    });

    // Save to localStorage
    const storedContacts = localStorage.getItem('mindscape_emergency_contacts');
    const contacts = storedContacts ? JSON.parse(storedContacts) : [];
    contacts.push(contact);
    localStorage.setItem('mindscape_emergency_contacts', JSON.stringify(contacts));
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-crisis p-2 rounded-l-md shadow-md z-50"
        aria-label="Crisis Help"
      >
        <Heart className="h-5 w-5 text-white" />
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-crisis">Crisis Help</h2>
            <button onClick={toggleSidebar} className="p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div className="bg-crisis/10 p-4 rounded-lg">
              <h3 className="font-semibold flex items-center mb-2">
                <Info className="h-4 w-4 mr-2" />
                Immediate Help
              </h3>
              <p className="text-sm mb-4">
                If you're having thoughts of harming yourself or others, please reach out for help immediately:
              </p>
              <a
                href="tel:988"
                className="flex items-center p-3 bg-white rounded-lg shadow-sm mb-2 hover:bg-gray-50"
              >
                <Phone className="h-5 w-5 text-crisis mr-3" />
                <div>
                  <div className="font-medium">988 Suicide & Crisis Lifeline</div>
                  <div className="text-xs text-muted-foreground">Call or text 988</div>
                </div>
              </a>
              <a
                href="sms:741741&body=HOME"
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
              >
                <MessageSquare className="h-5 w-5 text-crisis mr-3" />
                <div>
                  <div className="font-medium">Crisis Text Line</div>
                  <div className="text-xs text-muted-foreground">Text HOME to 741741</div>
                </div>
              </a>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Emergency Contacts</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddContactDialogOpen(true)}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 border rounded-lg bg-secondary/30"
                  >
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {contact.relationship}
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="mt-1 text-sm text-primary flex items-center"
                    >
                      <Phone className="h-3 w-3 mr-1" /> {contact.phone}
                    </a>
                  </div>
                ))}
                {emergencyContacts.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center p-3">
                    No emergency contacts added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Remember, it's okay to ask for help. Your well-being matters.
            </p>
            <a href="/mindful" className="button-secondary w-full flex justify-center">
              Mindfulness Exercises
            </a>
          </div>
        </div>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={addContactDialogOpen} onOpenChange={setAddContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Contact name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship (Optional)</Label>
              <Input
                id="relationship"
                placeholder="e.g., Friend, Therapist"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddContactDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddContact} className="bg-crisis text-white hover:bg-crisis-hover">
              <Save className="mr-2 h-4 w-4" /> Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
