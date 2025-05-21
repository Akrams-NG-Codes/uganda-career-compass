import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, getUserSessions, getSessionRecommendations } from "@/services/supabaseService";
import { UserProfile, UserSession, Career } from "@/types/careerGuide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    first_name: "",
    last_name: "",
    school: "",
    grade: "",
  });
  const [sessions, setSessions] = useState<(UserSession & { recommendations?: any[] })[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        school: profile.school || "",
        grade: profile.grade || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (user) {
        setLoadingSessions(true);
        try {
          const { data } = await getUserSessions(user.id);
          
          if (data) {
            const sessionsWithRecommendations = await Promise.all(
              data.map(async (session) => {
                const { data: recommendations } = await getSessionRecommendations(session.id);
                return {
                  ...session,
                  recommendations: recommendations || [],
                };
              })
            );
            
            setSessions(sessionsWithRecommendations);
          }
        } catch (error) {
          console.error("Error fetching sessions:", error);
        } finally {
          setLoadingSessions(false);
        }
      }
    };
    
    fetchSessions();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.id, formData);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setEditMode(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-chatbot-blue hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Section */}
          <Card className="w-full lg:w-1/3">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School</label>
                    <Input
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade/Class</label>
                    <Input
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">First Name</div>
                    <div>{profile?.first_name || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Last Name</div>
                    <div>{profile?.last_name || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">School</div>
                    <div>{profile?.school || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Grade/Class</div>
                    <div>{profile?.grade || "Not set"}</div>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                    <Button variant="outline" onClick={signOut}>Sign Out</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sessions History Section */}
          <Card className="w-full lg:w-2/3">
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Your past career guidance sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSessions ? (
                <div className="text-center py-4">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No sessions found</p>
                  <p className="text-sm">Start a conversation to explore career options</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <Card key={session.id} className="overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="text-sm font-medium">
                          Session from {new Date(session.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <div>
                            <div className="text-xs text-gray-500">Subjects</div>
                            <div className="text-sm">{session.subjects.join(", ")}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Interests</div>
                            <div className="text-sm">{session.interests.join(", ")}</div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs text-gray-500">Top Recommendations</div>
                          {session.recommendations && session.recommendations.length > 0 ? (
                            <ul className="list-disc list-inside text-sm">
                              {session.recommendations.slice(0, 3).map((rec: any) => (
                                <li key={rec.id}>{rec.careers?.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-sm">No recommendations recorded</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
