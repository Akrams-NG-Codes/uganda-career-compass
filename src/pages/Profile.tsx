import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, getUserSessions, getSessionRecommendations } from "@/services/supabaseService";
import { UserProfile, UserSession, Career } from "@/types/careerGuide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
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
          const { data, error } = await getUserSessions(user.id);
          
          if (error) {
            toast({
              title: "Error Loading Sessions",
              description: "Failed to load your career guidance sessions. Please try again later.",
              variant: "destructive",
            });
            return;
          }
          
          if (data) {
            const sessionsWithRecommendations = await Promise.all(
              data.map(async (session) => {
                try {
                  const { data: recommendations } = await getSessionRecommendations(session.id);
                  return {
                    ...session,
                    recommendations: recommendations || [],
                  };
                } catch (error) {
                  console.error("Error fetching recommendations:", error);
                  return {
                    ...session,
                    recommendations: [],
                  };
                }
              })
            );
            
            setSessions(sessionsWithRecommendations);
          }
        } catch (error) {
          console.error("Error fetching sessions:", error);
          toast({
            title: "Error Loading Sessions",
            description: "An unexpected error occurred while loading your sessions.",
            variant: "destructive",
          });
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

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );

  const SessionSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="bg-gray-50 p-3 border-b">
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div>
            <Skeleton className="h-3 w-1/4 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-3 w-1/4 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div>
          <Skeleton className="h-3 w-1/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/" className="flex items-center text-chatbot-blue hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Section */}
          <Card className="w-full lg:w-1/3">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSkeleton />
              ) : editMode ? (
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
                  <div className="pt-2">
                    <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
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
                <div className="space-y-4">
                  <SessionSkeleton />
                  <SessionSkeleton />
                  <SessionSkeleton />
                </div>
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
                          <div className="text-xs text-gray-500">Working Styles</div>
                          <div className="text-sm">{session.working_styles.join(", ")}</div>
                        </div>

                        <div className="mb-3">
                          <div className="text-xs text-gray-500">Goals</div>
                          <div className="text-sm">{session.goals || "Not specified"}</div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs text-gray-500">Top Recommendations</div>
                          {session.recommendations && session.recommendations.length > 0 ? (
                            <ul className="list-disc list-inside text-sm">
                              {session.recommendations.slice(0, 3).map((rec: any) => (
                                <li key={rec.id}>
                                  {rec.careers?.name}
                                  {rec.match_score && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      (Match: {Math.round(rec.match_score * 100)}%)
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-sm">No recommendations recorded</span>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="text-xs text-gray-500 mb-2">Conversation Summary</div>
                          <div className="text-sm space-y-2">
                            <p><strong>Initial Assessment:</strong> Based on your interests in {session.interests.join(", ")} and strengths in {session.subjects.join(", ")}, we explored career paths that align with your working style of {session.working_styles.join(", ")}.</p>
                            {session.goals && (
                              <p><strong>Your Goals:</strong> {session.goals}</p>
                            )}
                            <p><strong>Recommendation Basis:</strong> The suggested careers were selected based on your academic strengths, personal interests, and preferred working environment.</p>
                          </div>
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
