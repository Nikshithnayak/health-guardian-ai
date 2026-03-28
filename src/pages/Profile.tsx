import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Heart, Phone, Save, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    date_of_birth: "",
    height_cm: "",
    weight_kg: "",
    blood_type: "",
    allergies: "",
    medical_conditions: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          date_of_birth: data.date_of_birth || "",
          height_cm: data.height_cm?.toString() || "",
          weight_kg: data.weight_kg?.toString() || "",
          blood_type: data.blood_type || "",
          allergies: data.allergies?.join(", ") || "",
          medical_conditions: data.medical_conditions?.join(", ") || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
        });
      }
    } catch (e: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        full_name: profile.full_name || null,
        date_of_birth: profile.date_of_birth || null,
        height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
        weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
        blood_type: profile.blood_type || null,
        allergies: profile.allergies ? profile.allergies.split(",").map((s) => s.trim()).filter(Boolean) : null,
        medical_conditions: profile.medical_conditions ? profile.medical_conditions.split(",").map((s) => s.trim()).filter(Boolean) : null,
        emergency_contact_name: profile.emergency_contact_name || null,
        emergency_contact_phone: profile.emergency_contact_phone || null,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", user!.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Personal Info */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
            <p className="text-xs text-muted-foreground">Your basic health profile</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
            <input className={inputClass} value={profile.full_name} onChange={(e) => handleChange("full_name", e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
            <input type="date" className={inputClass} value={profile.date_of_birth} onChange={(e) => handleChange("date_of_birth", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
            <input type="number" className={inputClass} value={profile.height_cm} onChange={(e) => handleChange("height_cm", e.target.value)} placeholder="175" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
            <input type="number" className={inputClass} value={profile.weight_kg} onChange={(e) => handleChange("weight_kg", e.target.value)} placeholder="70" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Blood Type</label>
            <select className={inputClass} value={profile.blood_type} onChange={(e) => handleChange("blood_type", e.target.value)}>
              <option value="">Select blood type</option>
              {bloodTypes.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Medical Info */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center">
            <Heart className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Medical Information</h3>
            <p className="text-xs text-muted-foreground">Conditions and allergies</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Allergies (comma-separated)</label>
            <input className={inputClass} value={profile.allergies} onChange={(e) => handleChange("allergies", e.target.value)} placeholder="Penicillin, Peanuts" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Medical Conditions (comma-separated)</label>
            <input className={inputClass} value={profile.medical_conditions} onChange={(e) => handleChange("medical_conditions", e.target.value)} placeholder="Asthma, Hypertension" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span>This data is used by AI for personalized health analysis</span>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center">
            <Phone className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Emergency Contact</h3>
            <p className="text-xs text-muted-foreground">Who to contact in emergencies</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Contact Name</label>
            <input className={inputClass} value={profile.emergency_contact_name} onChange={(e) => handleChange("emergency_contact_name", e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Contact Phone</label>
            <input type="tel" className={inputClass} value={profile.emergency_contact_phone} onChange={(e) => handleChange("emergency_contact_phone", e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </div>

      {/* Save */}
      <Button onClick={handleSave} disabled={saving} className="w-full h-12">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </motion.div>
  );
};

export default Profile;
