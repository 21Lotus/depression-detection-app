import { useState, useEffect } from "react";
import { ArrowLeft, Save, User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  full_name: string;
  email: string;
  age: number | null;
  gender: string;
  medical_history: string;
  current_medications: string;
  alert_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
  };
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    email: "",
    age: null,
    gender: "",
    medical_history: "",
    current_medications: "",
    alert_preferences: {
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setProfileData({
            full_name: data.full_name || "",
            email: data.email || user.email || "",
            age: data.age,
            gender: data.gender || "",
            medical_history: data.medical_history || "",
            current_medications: data.current_medications || "",
            alert_preferences: (typeof data.alert_preferences === 'object' && data.alert_preferences !== null) 
              ? data.alert_preferences as { email_notifications: boolean; push_notifications: boolean; marketing_emails: boolean; }
              : {
                  email_notifications: true,
                  push_notifications: true,
                  marketing_emails: false,
                },
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: profileData.full_name,
            email: profileData.email,
            age: profileData.age,
            gender: profileData.gender,
            medical_history: profileData.medical_history,
            current_medications: profileData.current_medications,
            alert_preferences: profileData.alert_preferences,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateAlertPreference = (field: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      alert_preferences: {
        ...prev.alert_preferences,
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Profile</h1>
                <p className="text-xs text-muted-foreground">Manage your information</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                placeholder="Your full name"
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="your.email@example.com"
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profileData.age || ""}
                onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Your age"
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={profileData.gender}
                onValueChange={(value) => updateField('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={profileData.medical_history}
                onChange={(e) => updateField('medical_history', e.target.value)}
                placeholder="Please describe any relevant medical history..."
                rows={3}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                value={profileData.current_medications}
                onChange={(e) => updateField('current_medications', e.target.value)}
                placeholder="List your current medications..."
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your sample status</p>
              </div>
              <Switch
                id="email-notifications"
                checked={profileData.alert_preferences.email_notifications}
                onCheckedChange={(checked) => updateAlertPreference('email_notifications', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get real-time updates in the app</p>
              </div>
              <Switch
                id="push-notifications"
                checked={profileData.alert_preferences.push_notifications}
                onCheckedChange={(checked) => updateAlertPreference('push_notifications', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive health tips and product updates</p>
              </div>
              <Switch
                id="marketing-emails"
                checked={profileData.alert_preferences.marketing_emails}
                onCheckedChange={(checked) => updateAlertPreference('marketing_emails', checked)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {isEditing && (
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
}