import { useState } from "react";
import { ArrowLeft, Plus, Calendar, TrendingUp, Smile, Frown, Meh, Activity, Coffee, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface ActivityEntry {
  id: string;
  date: string;
  activity: string;
  category: string;
  duration: number;
  moodBefore: number;
  moodAfter: number;
  notes: string;
}

const moodIcons = [
  { value: 1, icon: <Frown className="h-5 w-5" />, label: "Very Low", color: "text-destructive" },
  { value: 2, icon: <Frown className="h-4 w-4" />, label: "Low", color: "text-warning" },
  { value: 3, icon: <Meh className="h-5 w-5" />, label: "Neutral", color: "text-muted-foreground" },
  { value: 4, icon: <Smile className="h-4 w-4" />, label: "Good", color: "text-success" },
  { value: 5, icon: <Smile className="h-5 w-5" />, label: "Great", color: "text-success" }
];

const activityCategories = [
  { value: "exercise", label: "Exercise", icon: <Activity className="h-4 w-4" /> },
  { value: "social", label: "Social", icon: <Coffee className="h-4 w-4" /> },
  { value: "rest", label: "Rest & Relaxation", icon: <Moon className="h-4 w-4" /> },
  { value: "work", label: "Work/Study", icon: <Calendar className="h-4 w-4" /> }
];

// Mock data for existing activities
const mockActivities: ActivityEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    activity: "Morning yoga",
    category: "exercise",
    duration: 30,
    moodBefore: 2,
    moodAfter: 4,
    notes: "Felt more centered after practice"
  },
  {
    id: "2", 
    date: "2024-01-14",
    activity: "Coffee with friends",
    category: "social",
    duration: 120,
    moodBefore: 3,
    moodAfter: 4,
    notes: "Great conversation, felt supported"
  }
];

export default function ActivityTracking() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityEntry[]>(mockActivities);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setActivity("");
    setCategory("");
    setDuration("");
    setMoodBefore(null);
    setMoodAfter(null);
    setNotes("");
  };

  const handleSubmit = () => {
    if (!activity || !category || !duration || moodBefore === null || moodAfter === null) {
      return;
    }

    const newEntry: ActivityEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      activity,
      category,
      duration: parseInt(duration),
      moodBefore,
      moodAfter,
      notes
    };

    setActivities([newEntry, ...activities]);
    resetForm();
    setShowAddForm(false);
  };

  const getMoodIcon = (value: number) => {
    const mood = moodIcons.find(m => m.value === value);
    return mood ? (
      <span className={mood.color}>
        {mood.icon}
      </span>
    ) : null;
  };

  const getCategoryIcon = (categoryValue: string) => {
    const cat = activityCategories.find(c => c.value === categoryValue);
    return cat?.icon;
  };

  const averageMoodImprovement = activities.length > 0 
    ? activities.reduce((sum, activity) => sum + (activity.moodAfter - activity.moodBefore), 0) / activities.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Activity Tracking</h1>
              <p className="text-xs text-muted-foreground">Track activities and mood patterns</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Overview Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{activities.length}</div>
                <div className="text-xs text-muted-foreground">Activities Logged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  +{averageMoodImprovement.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Mood Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Activity Button */}
        {!showAddForm && (
          <Button 
            className="w-full"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Activity
          </Button>
        )}

        {/* Add Activity Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Log New Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="activity">Activity</Label>
                <Input
                  id="activity"
                  placeholder="e.g., Morning walk, Meditation, Reading"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          {cat.icon}
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div>
                <Label>Mood Before</Label>
                <div className="flex gap-2 mt-2">
                  {moodIcons.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={moodBefore === mood.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMoodBefore(mood.value)}
                      className="p-2"
                    >
                      {mood.icon}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Mood After</Label>
                <div className="flex gap-2 mt-2">
                  {moodIcons.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={moodAfter === mood.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMoodAfter(mood.value)}
                      className="p-2"
                    >
                      {mood.icon}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did this activity make you feel?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  Save Activity
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity History */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(activity.category)}
                    <h4 className="font-semibold text-sm">{activity.activity}</h4>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{activity.duration} minutes</span>
                  <span className="capitalize">{activity.category}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Mood:</span>
                    {getMoodIcon(activity.moodBefore)}
                    <span className="text-xs">→</span>
                    {getMoodIcon(activity.moodAfter)}
                  </div>
                  
                  <div className={`text-xs font-medium ${
                    activity.moodAfter > activity.moodBefore ? "text-success" :
                    activity.moodAfter < activity.moodBefore ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {activity.moodAfter > activity.moodBefore ? "+" : ""}
                    {activity.moodAfter - activity.moodBefore}
                  </div>
                </div>

                {activity.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    "{activity.notes}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Return Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}