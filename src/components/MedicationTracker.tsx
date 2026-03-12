import { motion } from "framer-motion";
import { Pill, Clock, AlertCircle, Check } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  taken: boolean;
}

const medications: Medication[] = [
  { name: "Vitamin D3", dosage: "1000 IU", frequency: "Daily", nextDose: "8:00 AM", taken: true },
  { name: "Omega-3", dosage: "1000mg", frequency: "Twice daily", nextDose: "2:00 PM", taken: false },
  { name: "Magnesium", dosage: "400mg", frequency: "Before bed", nextDose: "10:00 PM", taken: false },
  { name: "Multivitamin", dosage: "1 tablet", frequency: "Daily", nextDose: "8:00 AM", taken: true },
];

const MedicationTracker = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
          <Pill className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Medication Tracker</h3>
          <p className="text-xs text-muted-foreground">Today's schedule</p>
        </div>
        <div className="ml-auto text-xs text-primary font-mono">
          {medications.filter(m => m.taken).length}/{medications.length} taken
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full bg-secondary mb-5">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(medications.filter(m => m.taken).length / medications.length) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-3">
        {medications.map((med, i) => (
          <motion.div
            key={med.name}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              med.taken ? "border-success/20 bg-success/5" : "border-border bg-secondary/30"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              med.taken ? "bg-success/20" : "bg-secondary"
            }`}>
              {med.taken ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${med.taken ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {med.name}
              </p>
              <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{med.nextDose}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
        <p className="text-xs text-warning">Omega-3 and Magnesium due today. Don't forget!</p>
      </div>
    </motion.div>
  );
};

export default MedicationTracker;
