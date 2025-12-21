'use client';

import { Sparkles, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Progress } from '@workspace/ui/components/progress';
import { useXpSystem } from '../hooks/use-xp-system';

export function LevelProgress() {
  const { level, currentXp, xpForNext, percentage } = useXpSystem();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Nível 1
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Progresso</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              0 / 100 XP
            </span>
          </div>
          <Progress value={0} className="h-3" />
          <p className="text-center text-muted-foreground">
            Complete desafios durante os intervalos para ganhar mais XP!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Nível {level}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Progresso</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-primary" />
            {currentXp} / {xpForNext} XP
          </span>
        </div>
        <Progress value={percentage} className="h-3" />
        <p className="text-center text-muted-foreground">
          Complete desafios durante os intervalos para ganhar mais XP!
        </p>
      </CardContent>
    </Card>
  );
}
