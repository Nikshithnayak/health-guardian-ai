import { useState } from "react";
import { Heart, Droplets, Wind, Thermometer, Moon, Zap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import VitalCard from "@/components/VitalCard";
import SymptomScanner from "@/components/SymptomScanner";
import RiskPrediction from "@/components/RiskPrediction";
import EmergencyPanel from "@/components/EmergencyPanel";
import HealthTwin from "@/components/HealthTwin";
import ActivityChart from "@/components/ActivityChart";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pl-20 lg:pl-64">
        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Health <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time monitoring • AI-powered predictions • 24/7 protection
            </p>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <VitalCard icon={Heart} label="Heart Rate" value="72" unit="bpm" status="normal" trend="↓ 3% from yesterday" animated />
            <VitalCard icon={Droplets} label="Blood Oxygen" value="98" unit="%" status="normal" trend="Stable" />
            <VitalCard icon={Wind} label="Blood Pressure" value="120/80" unit="mmHg" status="normal" trend="Optimal range" />
            <VitalCard icon={Thermometer} label="Temperature" value="98.4" unit="°F" status="normal" />
            <VitalCard icon={Moon} label="Sleep Score" value="76" unit="/100" status="warning" trend="↓ 8% this week" />
            <VitalCard icon={Zap} label="Stress Level" value="32" unit="/100" status="normal" trend="Low stress" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SymptomScanner />
            <EmergencyPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ActivityChart />
            <RiskPrediction />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <HealthTwin />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
