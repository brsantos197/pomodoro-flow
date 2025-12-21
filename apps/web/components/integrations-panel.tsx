'use client';
import { Github, Calendar, CheckSquare, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  color: string;
}

const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sincronize seus commits e contribuições',
    icon: Github,
    connected: false,
    color: 'text-gray-800',
  },
  {
    id: 'google-calendar',
    name: 'Google Agenda',
    description: 'Bloqueie tempo de foco no seu calendário',
    icon: Calendar,
    connected: false,
    color: 'text-blue-600',
  },
  {
    id: 'google-tasks',
    name: 'Google Tarefas',
    description: 'Importe tarefas para seus ciclos Pomodoro',
    icon: CheckSquare,
    connected: false,
    color: 'text-green-600',
  },
];

export function IntegrationsPanel() {
  const handleConnect = (integrationId: string) => {
    // Placeholder para integração futura
    alert(`Conectar com ${integrationId} - Funcionalidade em desenvolvimento`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
        <CardDescription>
          Conecte suas ferramentas favoritas para aumentar sua produtividade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-secondary rounded-lg ${integration.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{integration.name}</h4>
                      {integration.connected && (
                        <Badge variant="secondary" className="text-xs">
                          Conectado
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Button
                  variant={integration.connected ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => handleConnect(integration.id)}
                  className="gap-2"
                >
                  {integration.connected ? 'Configurar' : 'Conectar'}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}