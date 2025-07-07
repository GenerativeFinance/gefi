import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter, 
  Star, 
  Award, 
  Calendar, 
  DollarSign, 
  Clock, 
  Languages,
  Building,
  GraduationCap,
  FileText,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Eye,
  User,
  Mail,
  Phone
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  profile?: {
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    githubUsername?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    skills?: string[];
    specializations?: string[];
    yearsExperience?: number;
    professionalAlias?: string;
    hourlyRate?: number;
    projectFee?: number;
    methodology?: string;
    collaborationStyle?: string;
    overallRating?: number;
    totalReviews?: number;
    completedProjects?: number;
    responseTime?: string;
    languages?: string[];
    timezone?: string;
    profileViews?: number;
    isAvailableForProjects?: boolean;
    company?: string;
    jobTitle?: string;
    investmentExperience?: string;
    riskTolerance?: string;
  };
  education?: Array<{
    degree: string;
    fieldOfStudy: string;
    institution: string;
    startYear?: number;
    endYear?: number;
    gpa?: number;
    honors?: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
    keyAchievements?: string[];
    technologies?: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuingOrganization: string;
    issueDate?: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
  }>;
  skills?: Array<{
    category: string;
    name: string;
    proficiencyLevel: string;
    yearsOfExperience?: number;
    lastUsed?: string;
    isEndorsed?: boolean;
    endorsementCount?: number;
  }>;
  publications?: Array<{
    title: string;
    journal?: string;
    publicationDate?: string;
    doi?: string;
    url?: string;
    coAuthors?: string[];
    abstract?: string;
    keywords?: string[];
    citationCount?: number;
  }>;
  reviews?: Array<{
    id: number;
    rating: number;
    reviewText?: string;
    projectTitle?: string;
    projectCategory?: string;
    deliveryRating?: number;
    communicationRating?: number;
    qualityRating?: number;
    createdAt: string;
    reviewerUser: {
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
    };
  }>;
  stats?: {
    totalEarnings?: number;
    totalProjects?: number;
    successfulProjects?: number;
    averageDeliveryTime?: number;
    repeatClientRate?: number;
    onTimeDeliveryRate?: number;
    totalModelsSold?: number;
    totalRevenue?: number;
    topCategory?: string;
    rankInCategory?: number;
    overallRank?: number;
    badgesEarned?: string[];
    streakDays?: number;
  };
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['/api/users', userId, 'profile'],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const displayName = user.profile?.displayName || user.profile?.professionalAlias || 
    `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User';

  const profileCompletion = calculateProfileCompletion(user);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profileImageUrl} alt={displayName} />
                    <AvatarFallback className="text-lg">
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    {user.profile?.jobTitle && (
                      <p className="text-muted-foreground">{user.profile.jobTitle}</p>
                    )}
                    {user.profile?.company && (
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                        <Building className="h-3 w-3" />
                        {user.profile.company}
                      </p>
                    )}
                  </div>

                  {/* Rating & Stats */}
                  <div className="flex items-center gap-4">
                    {user.profile?.overallRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{user.profile.overallRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({user.profile.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  <Badge variant={user.profile?.isAvailableForProjects ? "default" : "secondary"}>
                    {user.profile?.isAvailableForProjects ? "Available for Projects" : "Currently Unavailable"}
                  </Badge>

                  {/* Profile Completion */}
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.profile?.completedProjects && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects Completed</span>
                    <span className="font-semibold">{user.profile.completedProjects}</span>
                  </div>
                )}
                {user.stats?.totalRevenue && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-semibold">${user.stats.totalRevenue.toLocaleString()}</span>
                  </div>
                )}
                {user.profile?.responseTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-semibold">{user.profile.responseTime}</span>
                  </div>
                )}
                {user.stats?.onTimeDeliveryRate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">On-Time Delivery</span>
                    <span className="font-semibold">{user.stats.onTimeDeliveryRate}%</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.profile.location}</span>
                  </div>
                )}
                {user.profile?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={user.profile.website} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      {user.profile.website}
                    </a>
                  </div>
                )}
                {user.profile?.githubUsername && (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a href={`https://github.com/${user.profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline">
                      @{user.profile.githubUsername}
                    </a>
                  </div>
                )}
                {user.profile?.linkedinUrl && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a href={user.profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {user.profile?.twitterUrl && (
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <a href={user.profile.twitterUrl} target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline">
                      Twitter Profile
                    </a>
                  </div>
                )}
                {user.profile?.timezone && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{user.profile.timezone}</span>
                  </div>
                )}
                {user.profile?.languages && user.profile.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span>{user.profile.languages.join(', ')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            {(user.profile?.hourlyRate || user.profile?.projectFee) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.profile.hourlyRate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly Rate</span>
                      <span className="font-semibold">${user.profile.hourlyRate}/hr</span>
                    </div>
                  )}
                  {user.profile.projectFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project Fee</span>
                      <span className="font-semibold">${user.profile.projectFee}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Bio */}
                {user.profile?.bio && (
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {user.profile.bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Specializations */}
                {user.profile?.specializations && user.profile.specializations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.profile.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Methodology */}
                {user.profile?.methodology && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Methodology</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{user.profile.methodology}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Collaboration Style */}
                {user.profile?.collaborationStyle && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Collaboration Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{user.profile.collaborationStyle}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Education */}
                {user.education && user.education.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          {(edu.startYear || edu.endYear) && (
                            <p className="text-sm text-muted-foreground">
                              {edu.startYear} - {edu.endYear || 'Present'}
                            </p>
                          )}
                          {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                          {edu.honors && <p className="text-sm text-primary">{edu.honors}</p>}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Certifications */}
                {user.certifications && user.certifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.certifications.map((cert, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-muted-foreground">{cert.issuingOrganization}</p>
                          {cert.issueDate && (
                            <p className="text-sm text-muted-foreground">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                          )}
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                               className="text-sm text-primary hover:underline">
                              View Credential
                            </a>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {user.experience && user.experience.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {user.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold text-lg">{exp.title}</h4>
                          <p className="text-primary font-medium">{exp.company}</p>
                          {exp.location && <p className="text-muted-foreground">{exp.location}</p>}
                          <p className="text-sm text-muted-foreground mb-3">
                            {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - {
                              exp.isCurrent ? 'Present' : 
                              exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'
                            }
                          </p>
                          {exp.description && (
                            <p className="text-muted-foreground mb-3">{exp.description}</p>
                          )}
                          {exp.keyAchievements && exp.keyAchievements.length > 0 && (
                            <div className="mb-3">
                              <h5 className="font-medium mb-2">Key Achievements:</h5>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {exp.keyAchievements.map((achievement, idx) => (
                                  <li key={idx}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {exp.technologies.map((tech, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{tech}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">No work experience information available.</p>
                    </CardContent>
                  </Card>
                )}

                {/* Publications */}
                {user.publications && user.publications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Publications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.publications.map((pub, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold">{pub.title}</h4>
                          {pub.journal && <p className="text-primary">{pub.journal}</p>}
                          {pub.publicationDate && (
                            <p className="text-sm text-muted-foreground">
                              Published: {new Date(pub.publicationDate).toLocaleDateString()}
                            </p>
                          )}
                          {pub.coAuthors && pub.coAuthors.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Co-authors: {pub.coAuthors.join(', ')}
                            </p>
                          )}
                          {pub.abstract && (
                            <p className="text-sm text-muted-foreground mt-2">{pub.abstract}</p>
                          )}
                          {pub.url && (
                            <a href={pub.url} target="_blank" rel="noopener noreferrer"
                               className="text-sm text-primary hover:underline">
                              View Publication
                            </a>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                {user.skills && user.skills.length > 0 ? (
                  <div className="space-y-6">
                    {['programming', 'frameworks', 'tools', 'domains'].map(category => {
                      const categorySkills = user.skills?.filter(skill => skill.category === category);
                      if (!categorySkills || categorySkills.length === 0) return null;
                      
                      return (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle className="capitalize">{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4">
                              {categorySkills.map((skill, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{skill.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {skill.proficiencyLevel}
                                      </Badge>
                                      {skill.isEndorsed && (
                                        <Badge variant="secondary" className="text-xs">
                                          <Zap className="h-3 w-3 mr-1" />
                                          Endorsed ({skill.endorsementCount})
                                        </Badge>
                                      )}
                                    </div>
                                    {skill.yearsOfExperience && (
                                      <p className="text-sm text-muted-foreground">
                                        {skill.yearsOfExperience} years experience
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">No skills information available.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {user.reviews && user.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {user.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.reviewerUser.profileImageUrl} />
                              <AvatarFallback>
                                {review.reviewerUser.firstName?.[0]}{review.reviewerUser.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">
                                  {review.reviewerUser.firstName} {review.reviewerUser.lastName}
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {review.projectTitle && (
                                <p className="text-sm text-primary mb-2">Project: {review.projectTitle}</p>
                              )}
                              {review.reviewText && (
                                <p className="text-muted-foreground">{review.reviewText}</p>
                              )}
                              <div className="flex gap-4 mt-3 text-sm">
                                {review.deliveryRating && (
                                  <span>Delivery: {review.deliveryRating}/5</span>
                                )}
                                {review.communicationRating && (
                                  <span>Communication: {review.communicationRating}/5</span>
                                )}
                                {review.qualityRating && (
                                  <span>Quality: {review.qualityRating}/5</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <Card>
                  <CardContent className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Portfolio projects will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Contact Button */}
        <div className="fixed bottom-8 right-8">
          <Button size="lg" className="rounded-full shadow-lg">
            <MessageSquare className="h-5 w-5 mr-2" />
            Contact {displayName.split(' ')[0]}
          </Button>
        </div>
      </div>
    </Layout>
  );
}

function calculateProfileCompletion(user: UserProfile): number {
  const fields = [
    user.profile?.bio,
    user.profile?.location,
    user.profile?.skills?.length,
    user.profile?.specializations?.length,
    user.profile?.yearsExperience,
    user.education?.length,
    user.experience?.length,
    user.profile?.website,
    user.profile?.githubUsername,
    user.profile?.linkedinUrl,
  ];
  
  const completedFields = fields.filter(field => 
    field !== undefined && field !== null && field !== ''
  ).length;
  
  return Math.round((completedFields / fields.length) * 100);
}