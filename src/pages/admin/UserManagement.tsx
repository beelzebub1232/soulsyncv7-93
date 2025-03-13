
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserX, 
  UserCog, 
  Mail,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/contexts/UserContext";

// Mock users for demonstration
const mockUsers = [
  {
    id: "1",
    username: "JaneDoe",
    email: "jane@example.com",
    role: "user" as UserRole,
    avatar: "/placeholder.svg",
    isVerified: true,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    joinDate: new Date(2023, 5, 10)
  },
  {
    id: "2",
    username: "JohnSmith",
    email: "john@example.com",
    role: "user" as UserRole,
    avatar: "/placeholder.svg",
    isVerified: true,
    lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    joinDate: new Date(2023, 6, 15)
  },
  {
    id: "3",
    username: "DrMichael",
    email: "michael@example.com",
    role: "professional" as UserRole,
    occupation: "Psychologist",
    avatar: "/placeholder.svg",
    isVerified: true,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    joinDate: new Date(2023, 7, 5)
  },
  {
    id: "4",
    username: "SamGreen",
    email: "sam@example.com",
    role: "user" as UserRole,
    avatar: "/placeholder.svg",
    isVerified: true,
    lastActive: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    joinDate: new Date(2023, 4, 20)
  },
  {
    id: "5",
    username: "DrEmily",
    email: "emily@example.com",
    role: "professional" as UserRole,
    occupation: "Therapist",
    avatar: "/placeholder.svg",
    isVerified: true,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    joinDate: new Date(2023, 5, 25)
  }
];

export default function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSuspendUser = (userId: string) => {
    // In a real app, this would call an API
    toast({
      title: "User suspended",
      description: "The user has been suspended.",
    });
  };
  
  const handleManageRoles = (userId: string) => {
    // In a real app, this would open a role management dialog
    toast({
      title: "Manage roles",
      description: "Role management dialog would open here.",
    });
  };
  
  const handleContactUser = (userId: string) => {
    // In a real app, this would open a mail composition dialog or interface
    toast({
      title: "Contact user",
      description: "Mail composition interface would open here.",
    });
  };
  
  const handleWarnUser = (userId: string) => {
    // In a real app, this would send a warning notification to the user
    toast({
      title: "Warning sent",
      description: "A warning has been sent to the user.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">View and manage user accounts.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Filter
          </Button>
          <Button variant="default" className="w-full sm:w-auto">
            Add User
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>All Users ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="divide-y">
              {filteredUsers.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No users found matching your search criteria.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {user.username}
                              {user.role === 'professional' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 text-xs">
                                  Professional
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          
                          <div className="mt-1 sm:mt-0 text-xs text-muted-foreground">
                            <div>Joined: {formatDate(user.joinDate)}</div>
                            <div>Last active: {formatDate(user.lastActive)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleManageRoles(user.id)}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Manage Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleContactUser(user.id)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Contact User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleWarnUser(user.id)}>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Send Warning
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
