import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Award, 
  Trophy, 
  Star, 
  Calendar,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBadgeSystem } from "@/hooks/useBadgeSystem";
import Header from "@/components/layout/header";

export default function UserProfile() {
  const { user } = useAuth();
  const { badges, getUnlockedBadges, getProgress, getBadgesByCategory, resetBadges } = useBadgeSystem();

  const unlockedBadges = getUnlockedBadges();
  const progress = getProgress();

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not earned';
    return new Date(date).toLocaleDateString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return '📚';
      case 'engagement':
        return '💬';
      case 'achievement':
        return '🏆';
      case 'milestone':
        return '🎯';
      default:
        return '⭐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'engagement':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'achievement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'milestone':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {user?.firstName || 'Financial Modeler'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Badge Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {progress.unlocked} of {progress.total} badges earned
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress.percentage}%
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Keep exploring to unlock more badges!</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetBadges}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Earned Badges ({unlockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unlockedBadges.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unlockedBadges.map((badge) => (
                  <Card key={badge.id} className="border-2 border-primary/20">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="font-semibold">{badge.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                        <Badge className={getCategoryColor(badge.category)}>
                          {badge.category}
                        </Badge>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(badge.unlockedDate)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No badges earned yet. Start exploring to unlock your first badge!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Badges Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              All Available Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['learning', 'engagement', 'achievement', 'milestone'].map((category) => {
                const categoryBadges = getBadgesByCategory(category as any);
                if (categoryBadges.length === 0) return null;

                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <h3 className="font-semibold capitalize">{category}</h3>
                      <Badge variant="outline">
                        {categoryBadges.filter(b => b.unlocked).length}/{categoryBadges.length}
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {categoryBadges.map((badge) => (
                        <Card 
                          key={badge.id} 
                          className={`transition-all ${
                            badge.unlocked 
                              ? 'border-primary/50 bg-primary/5' 
                              : 'opacity-60 border-dashed'
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {badge.unlocked ? badge.icon : '🔒'}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{badge.name}</div>
                                <p className="text-sm text-muted-foreground">
                                  {badge.description}
                                </p>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Progress: {badge.criteria.currentCount}/{badge.criteria.count}
                                </div>
                              </div>
                              {badge.unlocked && (
                                <div className="text-primary">
                                  <Award className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {category !== 'milestone' && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}