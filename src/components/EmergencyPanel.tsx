import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmergencyPanel = () => {
  const handleEmergency = (action: string) => {
    toast.info(`${action} — This would trigger a real ${action.toLowerCase()} in production.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-xl p-5 border border-destructive/20 glow-danger"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center"
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </motion.div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Emergency Response</h3>
          <p className="text-xs text-muted-foreground">Auto-detects critical health events</p>
        </div>
        <span className="ml-auto text-xs text-success flex items-center gap-1.5">
          <motion.span
            className="w-2 h-2 rounded-full bg-success"
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Monitoring
        </span>
      </div>

      {/* Status */}
      <motion.div
        className="bg-secondary/50 rounded-lg p-3 mb-4 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-primary/5"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ width: "30%" }}
        />
        <p className="text-xs text-muted-foreground mb-1">System Status</p>
        <p className="text-sm font-mono text-success relative z-10">ALL VITALS NORMAL — NO ALERTS</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button variant="emergency" size="sm" className="text-xs" onClick={() => handleEmergency("Emergency Call")}>
          <Phone className="w-3 h-3" />
          Call Emergency
        </Button>
        <Button variant="glass" size="sm" className="text-xs" onClick={() => handleEmergency("Location Sharing")}>
          <MapPin className="w-3 h-3" />
          Share Location
        </Button>
        <Button variant="glass" size="sm" className="text-xs" onClick={() => handleEmergency("Records Sent")}>
          <FileText className="w-3 h-3" />
          Send Records
        </Button>
        <Button variant="glass" size="sm" className="text-xs" onClick={() => handleEmergency("Family Alert")}>
          <Users className="w-3 h-3" />
          Alert Family
        </Button>
      </div>

      {/* Auto-detect features */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Auto-Detection Active</p>
        {["Heart attack patterns", "Fall detection", "Abnormal heart rate", "Oxygen drop"].map((feat, i) => (
          <motion.div
            key={feat}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center gap-2 text-xs text-secondary-foreground"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
            {feat}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmergencyPanel;
