
import { useState } from "react";
import { 
  Palette, 
  Bell, 
  User, 
  Shield, 
  HelpCircle, 
  Info, 
  Moon, 
  Sun,
  ChevronRight,
  Check
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define available themes
const themeOptions = [
  { name: "Purple", value: "purple", color: "#9b87f5", bgColor: "#E5DEFF" },
  { name: "Green", value: "green", color: "#85D996", bgColor: "#F2FCE2" },
  { name: "Yellow", value: "yellow", color: "#FFD466", bgColor: "#FEF7CD" },
  { name: "Orange", value: "orange", color: "#FFA35C", bgColor: "#FEC6A1" },
  { name: "Pink", value: "pink", color: "#FF9FB6", bgColor: "#FFDEE2" },
  { name: "Peach", value: "peach", color: "#FFBB9A", bgColor: "#FDE1D3" },
  { name: "Blue", value: "blue", color: "#7CC4FA", bgColor: "#D3E4FD" }
];

export default function Settings() {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themeOptions[0]);
  const [notificationSettings, setNotificationSettings] = useState({
    moodReminders: true,
    journalReminders: true,
    communityUpdates: true,
    newContent: true
  });
  
  const handleThemeChange = (theme: typeof themeOptions[0]) => {
    setSelectedTheme(theme);
    
    // Here we would update CSS variables for the theme
    // This is a simplified example
    document.documentElement.style.setProperty('--theme-primary', theme.color);
    document.documentElement.style.setProperty('--theme-light', theme.bgColor);
    
    toast({
      title: "Theme updated",
      description: `Your theme has been changed to ${theme.name}.`,
    });
  };
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Toggle dark mode class on document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newMode ? "Dark mode enabled" : "Light mode enabled",
      description: "Your display preference has been updated.",
    });
  };
  
  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} notifications ${notificationSettings[key] ? 'disabled' : 'enabled'}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </header>
      
      {/* Account section */}
      <section className="card-primary space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-mindscape-primary">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-mindscape-light text-mindscape-primary">
              {user?.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <p className="font-medium">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <button className="text-xs text-primary mt-1">Change Profile Picture</button>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <button className="w-full p-3 text-left rounded-lg hover:bg-mindscape-light/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-mindscape-primary" />
              <span>Edit Profile</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="w-full p-3 text-left rounded-lg hover:bg-mindscape-light/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-mindscape-primary" />
              <span>Privacy & Security</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </section>
      
      {/* Appearance section */}
      <section className="card-primary space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5 text-mindscape-primary" />
          <span>Appearance</span>
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="h-5 w-5 text-indigo-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium mb-3">Theme Colors</h3>
          <div className="grid grid-cols-4 gap-3">
            {themeOptions.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme)}
                className={cn(
                  "w-full aspect-square rounded-full",
                  "flex items-center justify-center",
                  "transition-all hover:scale-105 border-2",
                  selectedTheme.value === theme.value 
                    ? "border-gray-800 dark:border-white" 
                    : "border-transparent"
                )}
                style={{ backgroundColor: theme.color }}
                aria-label={`${theme.name} theme`}
              >
                {selectedTheme.value === theme.value && (
                  <Check className="h-5 w-5 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Notifications section */}
      <section className="card-primary space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-mindscape-primary" />
          <span>Notifications</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mood-reminders">Daily Mood Check-in Reminders</Label>
            <Switch
              id="mood-reminders"
              checked={notificationSettings.moodReminders}
              onCheckedChange={() => toggleNotification('moodReminders')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="journal-reminders">Journal Reminders</Label>
            <Switch
              id="journal-reminders"
              checked={notificationSettings.journalReminders}
              onCheckedChange={() => toggleNotification('journalReminders')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="community-updates">Community Updates</Label>
            <Switch
              id="community-updates"
              checked={notificationSettings.communityUpdates}
              onCheckedChange={() => toggleNotification('communityUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="new-content">New Content Notifications</Label>
            <Switch
              id="new-content"
              checked={notificationSettings.newContent}
              onCheckedChange={() => toggleNotification('newContent')}
            />
          </div>
        </div>
      </section>
      
      {/* Help & About section */}
      <section className="card-primary space-y-2">
        <h2 className="text-lg font-semibold mb-2">Help & About</h2>
        
        <button className="w-full p-3 text-left rounded-lg hover:bg-mindscape-light/50 transition-all flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-mindscape-primary" />
            <span>Help Center</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <button className="w-full p-3 text-left rounded-lg hover:bg-mindscape-light/50 transition-all flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-mindscape-primary" />
            <span>About SoulSync</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <div className="pt-2 text-center text-xs text-muted-foreground">
          <p>SoulSync v1.0.0</p>
          <p className="mt-1">© 2023 SoulSync. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
}
