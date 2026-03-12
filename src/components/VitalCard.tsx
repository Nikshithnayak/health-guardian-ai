import { LucideIcon } from "lucide-react";

interface VitalCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "danger";
  trend?: string;
  animated?: boolean;
}

const statusStyles = {
  normal: {
    glow: "glow-success",
    iconBg: "bg-success/15",
    iconColor: "text-success",
    badge: "bg-success/15 text-success",
  },
  warning: {
    glow: "glow-warning",
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    badge: "bg-warning/15 text-warning",
  },
  danger: {
    glow: "glow-danger",
    iconBg: "bg-destructive/15",
    iconColor: "text-destructive",
    badge: "bg-destructive/15 text-destructive",
  },
};

const VitalCard = ({ icon: Icon, label, value, unit, status, trend, animated }: VitalCardProps) => {
  const style = statusStyles[status];

  return (
    <div className={`glass-card rounded-xl p-5 ${style.glow} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.iconColor} ${animated ? "animate-heartbeat" : ""}`} />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${style.badge} font-medium capitalize`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-2">{trend}</p>
      )}
    </div>
  );
};

export default VitalCard;
