import { useState, useEffect } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'engagement' | 'achievement' | 'milestone';
  unlocked: boolean;
  unlockedDate?: Date;
  criteria: {
    action: string;
    count: number;
    currentCount: number;
  };
}

const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_subscription',
    name: 'Early Adopter',
    description: 'Subscribe to your first AI model',
    icon: '🎯',
    category: 'milestone',
    unlocked: false,
    criteria: {
      action: 'model_subscription',
      count: 1,
      currentCount: 0
    }
  },
  {
    id: 'model_reviewer',
    name: 'Model Critic',
    description: 'Leave your first model review',
    icon: '⭐',
    category: 'engagement',
    unlocked: false,
    criteria: {
      action: 'model_review',
      count: 1,
      currentCount: 0
    }
  },
  {
    id: 'learning_enthusiast',
    name: 'Knowledge Seeker',
    description: 'Visit the Learning Center',
    icon: '📚',
    category: 'learning',
    unlocked: false,
    criteria: {
      action: 'learning_center_visit',
      count: 1,
      currentCount: 0
    }
  },
  {
    id: 'portfolio_optimizer',
    name: 'Portfolio Master',
    description: 'Create and optimize your first portfolio',
    icon: '📈',
    category: 'achievement',
    unlocked: false,
    criteria: {
      action: 'portfolio_creation',
      count: 1,
      currentCount: 0
    }
  },
  {
    id: 'active_trader',
    name: 'Active Trader',
    description: 'Subscribe to 5 different AI models',
    icon: '🔥',
    category: 'achievement',
    unlocked: false,
    criteria: {
      action: 'model_subscription',
      count: 5,
      currentCount: 0
    }
  }
];

export function useBadgeSystem() {
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);

  useEffect(() => {
    // Load badges from localStorage on initialization
    const savedBadges = localStorage.getItem('gefi_user_badges');
    if (savedBadges) {
      try {
        const parsedBadges = JSON.parse(savedBadges);
        setBadges(parsedBadges);
      } catch (error) {
        console.error('Error parsing saved badges:', error);
        saveBadges(INITIAL_BADGES);
      }
    } else {
      saveBadges(INITIAL_BADGES);
    }
  }, []);

  const saveBadges = (badgesToSave: Badge[]) => {
    localStorage.setItem('gefi_user_badges', JSON.stringify(badgesToSave));
  };

  const trackAction = (action: string) => {
    setBadges(currentBadges => {
      const updatedBadges = currentBadges.map(badge => {
        if (badge.criteria.action === action && !badge.unlocked) {
          const newCount = badge.criteria.currentCount + 1;
          const shouldUnlock = newCount >= badge.criteria.count;
          
          return {
            ...badge,
            criteria: {
              ...badge.criteria,
              currentCount: newCount
            },
            unlocked: shouldUnlock,
            unlockedDate: shouldUnlock ? new Date() : badge.unlockedDate
          };
        }
        return badge;
      });

      saveBadges(updatedBadges);

      // Check for newly unlocked badges
      const newlyUnlocked = updatedBadges.filter(
        (badge, index) => badge.unlocked && !currentBadges[index].unlocked
      );

      // Show notifications for newly unlocked badges
      newlyUnlocked.forEach(badge => {
        showBadgeNotification(badge);
      });

      return updatedBadges;
    });
  };

  const showBadgeNotification = (badge: Badge) => {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right';
    
    // Create elements safely using DOM methods
    const container = document.createElement('div');
    container.className = 'flex items-center gap-3';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'text-2xl';
    iconSpan.textContent = badge.icon; // Safe: textContent escapes HTML
    
    const textContainer = document.createElement('div');
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'font-semibold';
    titleDiv.textContent = 'Badge Unlocked!'; // Safe: static text
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'text-sm opacity-90';
    nameDiv.textContent = badge.name; // Safe: textContent escapes HTML
    
    // Assemble the DOM structure
    textContainer.appendChild(titleDiv);
    textContainer.appendChild(nameDiv);
    container.appendChild(iconSpan);
    container.appendChild(textContainer);
    notification.appendChild(container);

    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  const getUnlockedBadges = () => badges.filter(badge => badge.unlocked);
  
  const getProgress = () => {
    const totalBadges = badges.length;
    const unlockedCount = getUnlockedBadges().length;
    return {
      total: totalBadges,
      unlocked: unlockedCount,
      percentage: Math.round((unlockedCount / totalBadges) * 100)
    };
  };

  const getBadgesByCategory = (category: Badge['category']) => 
    badges.filter(badge => badge.category === category);

  const resetBadges = () => {
    setBadges(INITIAL_BADGES);
    saveBadges(INITIAL_BADGES);
  };

  return {
    badges,
    trackAction,
    getUnlockedBadges,
    getProgress,
    getBadgesByCategory,
    resetBadges
  };
}