import Image from 'next/image';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { BackgroundIcons } from './background-icons';
import { ChallengeDialog } from './challenge-dialog';
import { LevelProgress } from './level-progress';
import { PomodoroTimer } from './pomodoro-timer';
import { ThemeToggle } from './theme-toggle';
import { TodoList } from './todo-list';

export default function App() {
  return (
    <NuqsAdapter>
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-via), var(--gradient-to))'
        }}
      >
        {/* Background Icons */}
        <BackgroundIcons />

        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 gap-6">
            <div>
              <div className='flex items-center gap-3'>
                <Image src='/images/logo.png' alt="Pomodoro Flow Logo" width={50} height={50} className='rounded' />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Pomodoro Flow
                </h1>
              </div>
              <p className="text-muted-foreground mt-1">
                Aumente sua produtividade com gamificação
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          {/* Level Progress - Acima dos outros cards */}
          <div className="mb-6">
            <LevelProgress />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Timer - 1/3 do espaço (esquerda) */}
            <div>
              <PomodoroTimer />
            </div>

            {/* TodoList - 2/3 do espaço (direita) */}
            <div className="lg:col-span-2">
              <TodoList />
            </div>
          </div>

          {/* Amigos - Agora abaixo */}
          <div className="w-full mb-6">
            {/* <FriendsPanel /> */}
          </div>

          {/* Integrações */}
          <div className="w-full">
            {/* <IntegrationsPanel /> */}
          </div>

          {/* Challenge Dialog - aparece automaticamente */}
          <ChallengeDialog />
        </div>
      </div>
    </NuqsAdapter>
  );
}