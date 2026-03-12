import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Droplets, Wind, Thermometer, Moon, Zap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import VitalCard from "@/components/VitalCard";
import SymptomScanner from "@/components/SymptomScanner";
import RiskPrediction from "@/components/RiskPrediction";
import EmergencyPanel from "@/components/EmergencyPanel";
import HealthTwin from "@/components/HealthTwin";
import ActivityChart from "@/components/ActivityChart";
import MentalHealthChat from "@/components/MentalHealthChat";
import MedicationTracker from "@/components/MedicationTracker";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const Dashboard = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <VitalCard icon={Heart} label="Heart Rate" value="72" unit="bpm" status="normal" trend="↓ 3% from yesterday" animated index={0} />
      <VitalCard icon={Droplets} label="Blood Oxygen" value="98" unit="%" status="normal" trend="Stable" index={1} />
      <VitalCard icon={Wind} label="Blood Pressure" value="120/80" unit="mmHg" status="normal" trend="Optimal" index={2} />
      <VitalCard icon={Thermometer} label="Temperature" value="98.4" unit="°F" status="normal" index={3} />
      <VitalCard icon={Moon} label="Sleep Score" value="76" unit="/100" status="warning" trend="↓ 8% this week" index={4} />
      <VitalCard icon={Zap} label="Stress Level" value="32" unit="/100" status="normal" trend="Low stress" index={5} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <SymptomScanner />
      <EmergencyPanel />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ActivityChart />
      <RiskPrediction />
    </div>
    <HealthTwin />
  </motion.div>
);

const SymptomPage = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="max-w-3xl mx-auto">
      <SymptomScanner />
    </div>
  </motion.div>
);

const VitalsPage = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <VitalCard icon={Heart} label="Heart Rate" value="72" unit="bpm" status="normal" trend="↓ 3%" animated index={0} />
      <VitalCard icon={Droplets} label="Blood Oxygen" value="98" unit="%" status="normal" trend="Stable" index={1} />
      <VitalCard icon={Wind} label="Blood Pressure" value="120/80" unit="mmHg" status="normal" index={2} />
      <VitalCard icon={Thermometer} label="Temperature" value="98.4" unit="°F" status="normal" index={3} />
      <VitalCard icon={Moon} label="Sleep Score" value="76" unit="/100" status="warning" index={4} />
      <VitalCard icon={Zap} label="Stress Level" value="32" unit="/100" status="normal" index={5} />
    </div>
    <ActivityChart />
  </motion.div>
);

const PredictionPage = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RiskPrediction />
      <HealthTwin />
    </div>
  </motion.div>
);

const EmergencyPage = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="max-w-2xl mx-auto">
      <EmergencyPanel />
    </div>
  </motion.div>
);

const MentalPage = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="max-w-3xl mx-auto">
      <MentalHealthChat />
    </div>
  </motion.div>
);

const MedicinePage = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
    <div className="max-w-2xl mx-auto">
      <MedicationTracker />
    </div>
  </motion.div>
);

const tabComponents: Record<string, React.FC> = {
  dashboard: Dashboard,
  symptom: SymptomPage,
  vitals: VitalsPage,
  prediction: PredictionPage,
  emergency: EmergencyPage,
  mental: MentalPage,
  medicine: MedicinePage,
};

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard",
  symptom: "AI Symptom Scanner",
  vitals: "Health Vitals",
  prediction: "Risk Prediction",
  emergency: "Emergency Response",
  mental: "Mental Wellness",
  medicine: "Medications",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ActiveComponent = tabComponents[activeTab] || Dashboard;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pl-20 lg:pl-64">
        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-foreground">
              Health <span className="gradient-text">{tabTitles[activeTab]}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time monitoring • AI-powered predictions • 24/7 protection
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <ActiveComponent key={activeTab} />
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
