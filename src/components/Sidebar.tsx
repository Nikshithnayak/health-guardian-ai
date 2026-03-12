import { motion } from "framer-motion";
import { 
  Activity, Brain, Shield, Heart, MessageCircle, 
  AlertTriangle, Pill, BarChart3, Settings, User, LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, signOut } = useAuth();

  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 z-40 h-screen w-20 lg:w-64 bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <motion.div
          className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring" }}
        >
          <Shield className="w-6 h-6 text-primary" />
        </motion.div>
        <div className="hidden lg:block">
          <h1 className="text-sm font-bold gradient-text">MedGuardian</h1>
          <p className="text-xs text-muted-foreground">AI Health Command</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary glow-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              <span className="hidden lg:block">{item.label}</span>
              {item.id === "emergency" && (
                <motion.span
                  className="hidden lg:block ml-auto w-2 h-2 rounded-full bg-destructive"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.user_metadata?.full_name || user?.email || "User"}
            </p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
