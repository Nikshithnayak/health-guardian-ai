import { AlertTriangle, Phone, MapPin, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmergencyPanel = () => {
  return (
    <div className="glass-card rounded-xl p-5 border border-destructive/20 glow-danger">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive animate-heartbeat" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Emergency Response</h3>
          <p className="text-xs text-muted-foreground">Auto-detects critical health events</p>
        </div>
        <span className="ml-auto text-xs text-success flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success pulse-ring" />
          Monitoring
        </span>
      </div>

      {/* Status */}
      <div className="bg-secondary/50 rounded-lg p-3 mb-4">
        <p className="text-xs text-muted-foreground mb-1">System Status</p>
        <p className="text-sm font-mono text-success">ALL VITALS NORMAL — NO ALERTS</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button variant="emergency" size="sm" className="text-xs">
          <Phone className="w-3 h-3" />
          Call Emergency
        </Button>
        <Button variant="glass" size="sm" className="text-xs">
          <MapPin className="w-3 h-3" />
          Share Location
        </Button>
        <Button variant="glass" size="sm" className="text-xs">
          <FileText className="w-3 h-3" />
          Send Records
        </Button>
        <Button variant="glass" size="sm" className="text-xs">
          <Users className="w-3 h-3" />
          Alert Family
        </Button>
      </div>

      {/* Auto-detect features */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Auto-Detection Active</p>
        {["Heart attack patterns", "Fall detection", "Abnormal heart rate", "Oxygen drop"].map((feat) => (
          <div key={feat} className="flex items-center gap-2 text-xs text-secondary-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {feat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyPanel;
