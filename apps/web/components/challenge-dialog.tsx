'use client';

import React, { useEffect } from 'react';
import { Award, X, CheckCircle2, Dumbbell, Brain, Droplet, Wind } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { useChallengeContext } from '../context/challenge-context';
import { usePomodoroContext } from '../context/pomodoro-context';
import { useXpSystem } from '../hooks/use-xp-system';

const challengeIcons = {
  physical: Dumbbell,
  mental: Brain,
  hydration: Droplet,
  stretch: Wind,
};

export function ChallengeDialog() {
  const { challenge, showSuccess, canCompleteChallenge, closeChallenge, skipChallenge, openChallenge } = useChallengeContext();
  const { isModalOpen, closeModal } = usePomodoroContext();
  const { addXp } = useXpSystem();

  const handleComplete = () => {
    if (challenge) {
      addXp(challenge.xpReward);
      closeChallenge();
      closeModal();
    }
  };

  const handleSkip = () => {
    skipChallenge();
    closeModal();
  };

  const Icon = challenge ? challengeIcons[challenge.type] : null;

  // Abrir o desafio quando o modal abre
  useEffect(() => {
    if (isModalOpen && !challenge) {
      openChallenge();
    }
  }, [isModalOpen, challenge, openChallenge]);

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md" data-challenge-modal="true">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {Icon && <Icon className="w-6 h-6 text-primary" />}
                Desafio do Intervalo!
              </DialogTitle>
              <DialogDescription className="sr-only">
                Desafio para ganhar XP durante o intervalo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Complete este desafio para ganhar XP extra
              </p>
              <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">{challenge?.title}</h3>
                <div className="text-sm text-muted-foreground">{challenge?.description}</div>
              </div>

              <div className="flex items-center justify-center gap-2 text-primary">
                <Award className="w-5 h-5" />
                <span className="font-semibold">+{challenge?.xpReward} XP</span>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleSkip} className="gap-2">
                <X className="w-4 h-4" />
                Pular
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!canCompleteChallenge}
                className="gap-2"
                title={!canCompleteChallenge ? "Aguarde 3/4 do tempo de intervalo" : ""}
              >
                <CheckCircle2 className="w-4 h-4" />
                Completei!
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary animate-pulse" />
            <h3 className="text-2xl font-semibold">Parabéns!</h3>
            <p className="text-muted-foreground">
              Você ganhou +{challenge?.xpReward} XP
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
