import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface VitalCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "danger";
  trend?: string;
  animated?: boolean;
  index?: number;
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

const VitalCard = ({ icon: Icon, label, value, unit, status, trend, animated, index = 0 }: VitalCardProps) => {
  const style = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.04, y: -4 }}
      className={`glass-card rounded-xl p-5 ${style.glow} transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <motion.div
          className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center`}
          animate={animated ? { scale: [1, 1.15, 1, 1.1, 1] } : undefined}
          transition={animated ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : undefined}
        >
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 + 0.3 }}
          className={`text-xs px-2 py-1 rounded-full ${style.badge} font-medium capitalize`}
        >
          {status}
        </motion.span>
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <motion.span
          className="text-2xl font-bold font-mono text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.2 }}
        >
          {value}
        </motion.span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-2">{trend}</p>
      )}
    </motion.div>
  );
};

export default VitalCard;
