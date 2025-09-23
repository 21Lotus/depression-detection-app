import { useState } from "react";
import { ChevronRight, ChevronLeft, User, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  fullName: string;
  age: string;
  email: string;
  gender: string;
  medicalHistory: string;
  currentMedications: string;
  emailAlerts: boolean;
  criticalAlerts: boolean;
  analysisAlerts: boolean;
}

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    age: "",
    email: "",
    gender: "",
    medicalHistory: "",
    currentMedications: "",
    emailAlerts: true,
    criticalAlerts: true,
    analysisAlerts: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateData = (field: keyof OnboardingData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // 1) Check if a user session already exists
      const { data: userData } = await supabase.auth.getUser();
      let userId: string | null = userData.user?.id ?? null;
      let userEmail: string = userData.user?.email ?? data.email;

      // 2) If no active session, try to sign up; if the user already exists, send magic link instead
      if (!userId) {
        const tempPassword = `temp_${Math.random().toString(36).substr(2, 9)}`;
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: tempPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (authError) {
          // Handle existing user gracefully: send a magic link to log in
          if ((authError as any)?.code === 'user_already_exists') {
            const { error: otpError } = await supabase.auth.signInWithOtp({
              email: data.email,
              options: { emailRedirectTo: `${window.location.origin}/` },
            });

            if (otpError) throw otpError;

            toast({
              title: "Check your email",
              description: "We sent you a secure login link to continue onboarding.",
            });
            return; // Stop here; user will continue after logging in
          }

          throw authError;
        }

        userId = authData.user?.id ?? null;
        userEmail = data.email;

        // Wait a moment for the session to be established
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (!userId) throw new Error('No authenticated user available to save profile.');

      // 3) Create or update profile
      const { data: existing, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (selectError && (selectError as any).code !== 'PGRST116') {
        throw selectError;
      }

      const baseProfile = {
        user_id: userId,
        full_name: data.fullName,
        age: data.age ? parseInt(data.age) : null,
        email: userEmail,
        gender: data.gender,
        medical_history: data.medicalHistory,
        current_medications: data.currentMedications,
        alert_preferences: {
          email_alerts: data.emailAlerts,
          critical_alerts: data.criticalAlerts,
          analysis_alerts: data.analysisAlerts,
        },
        onboarding_completed: true,
      } as const;

      if (existing && existing.length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(baseProfile)
          .eq('user_id', userId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(baseProfile);
        if (insertError) throw insertError;
      }

      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });

      // 4) Navigate to home
      window.location.href = '/';
    } catch (error: any) {
      console.error('Onboarding error:', error);

      let errorMessage = "There was a problem creating your profile. Please try again.";

      if (error?.code === 'over_email_send_rate_limit') {
        errorMessage = "Please wait a moment before trying again due to rate limiting.";
      } else if (error?.message?.includes('row-level security')) {
        errorMessage = "Authentication setup issue. Please wait a moment and try again.";
      } else if (error?.code === 'user_already_exists') {
        errorMessage = "This email is already registered. We sent you a login link.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const slides = [
    {
      title: "Personal Information",
      icon: <User className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => updateData('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={data.age}
              onChange={(e) => updateData('age', e.target.value)}
              placeholder="Enter your age"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateData('email', e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={data.gender} onValueChange={(value) => updateData('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: "Medical History",
      icon: <Heart className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              value={data.medicalHistory}
              onChange={(e) => updateData('medicalHistory', e.target.value)}
              placeholder="Include any previous depression diagnoses, mental health disorders, or other relevant medical conditions..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              value={data.currentMedications}
              onChange={(e) => updateData('currentMedications', e.target.value)}
              placeholder="List any medications you are currently taking, including dosages..."
              rows={4}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Alert Preferences",
      icon: <Bell className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailAlerts" className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              id="emailAlerts"
              checked={data.emailAlerts}
              onCheckedChange={(checked) => updateData('emailAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="criticalAlerts" className="text-base font-medium">Critical Alerts</Label>
              <p className="text-sm text-muted-foreground">Immediate notifications for urgent results</p>
            </div>
            <Switch
              id="criticalAlerts"
              checked={data.criticalAlerts}
              onCheckedChange={(checked) => updateData('criticalAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analysisAlerts" className="text-base font-medium">Analysis Updates</Label>
              <p className="text-sm text-muted-foreground">Notifications when sample analysis is complete</p>
            </div>
            <Switch
              id="analysisAlerts"
              checked={data.analysisAlerts}
              onCheckedChange={(checked) => updateData('analysisAlerts', checked)}
            />
          </div>
        </div>
      ),
    },
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            {currentSlideData.icon}
            <div>
              <CardTitle>{currentSlideData.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Step {currentSlide + 1} of {slides.length}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSlideData.content}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextSlide}>
              {currentSlide === slides.length - 1 ? 'Complete' : 'Next'}
              {currentSlide < slides.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}