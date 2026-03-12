import { 
  Activity, Brain, Shield, Heart, MessageCircle, 
  AlertTriangle, Pill, BarChart3, Settings, User
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", icon: Activity, label: "Dashboard" },
  { id: "symptom", icon: Brain, label: "Symptom Scanner" },
  { id: "vitals", icon: Heart, label: "Vitals" },
  { id: "prediction", icon: BarChart3, label: "Risk Prediction" },
  { id: "emergency", icon: AlertTriangle, label: "Emergency" },
  { id: "mental", icon: MessageCircle, label: "Mental Health" },
  { id: "medicine", icon: Pill, label: "Medications" },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 lg:w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-sm font-bold gradient-text">MedGuardian</h1>
          <p className="text-xs text-muted-foreground">AI Health Command</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary glow-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              <span className="hidden lg:block">{item.label}</span>
              {item.id === "emergency" && (
                <span className="hidden lg:block ml-auto w-2 h-2 rounded-full bg-destructive pulse-ring" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-medium text-foreground">User Profile</p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
          <Settings className="w-4 h-4 hidden lg:block ml-auto text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
