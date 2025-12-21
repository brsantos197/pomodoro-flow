'use client';
import { Users, Trophy, UserPlus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';

interface Friend {
  id: string;
  name: string;
  level: number;
  xp: number;
  avatar: string;
  todayCycles: number;
}

// Mock data - em produção viria do backend
const friends: Friend[] = [
  {
    id: '1',
    name: 'Ana Silva',
    level: 12,
    xp: 14500,
    avatar: '👩‍💻',
    todayCycles: 8,
  },
  {
    id: '2',
    name: 'Carlos Santos',
    level: 9,
    xp: 8200,
    avatar: '👨‍💼',
    todayCycles: 5,
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    level: 15,
    xp: 22600,
    avatar: '👩‍🎨',
    todayCycles: 12,
  },
  {
    id: '4',
    name: 'João Costa',
    level: 7,
    xp: 5000,
    avatar: '👨‍🔬',
    todayCycles: 3,
  },
];

export function FriendsPanel() {
  const sortedFriends = [...friends].sort((a, b) => b.level - a.level);

  const handleAddFriend = () => {
    alert('Adicionar amigo - Funcionalidade em desenvolvimento');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Amigos
            </CardTitle>
            <CardDescription>Acompanhe o progresso dos seus amigos</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddFriend} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedFriends.map((friend, index) => {
            const xpForCurrentLevel = (friend.level - 1) * (friend.level - 1) * 100;
            const xpForNextLevel = friend.level * friend.level * 100;
            const currentXp = friend.xp - xpForCurrentLevel;
            const xpNeeded = xpForNextLevel - xpForCurrentLevel;
            const percentage = (currentXp / xpNeeded) * 100;

            return (
              <div key={friend.id} className="flex items-center gap-4 p-3 border rounded-lg">
                {/* Ranking */}
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 && <Trophy className="w-6 h-6 text-yellow-500 mx-auto" />}
                  {index === 1 && <Trophy className="w-6 h-6 text-gray-400 mx-auto" />}
                  {index === 2 && <Trophy className="w-6 h-6 text-amber-700 mx-auto" />}
                  {index > 2 && <span className="text-muted-foreground">#{index + 1}</span>}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
                  {friend.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{friend.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      Nv {friend.level}
                    </Badge>
                  </div>
                  <Progress value={percentage} className="h-2 mb-1" />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{friend.xp.toLocaleString()} XP</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {friend.todayCycles} ciclos hoje
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {friends.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum amigo adicionado ainda</p>
            <Button variant="outline" size="sm" onClick={handleAddFriend} className="mt-4 gap-2">
              <UserPlus className="w-4 h-4" />
              Adicionar Primeiro Amigo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
