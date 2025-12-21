'use client';

import { Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { useState } from 'react';
import { useSettings } from '../context/settings-context';

const settingsSchema = z.object({
  workDuration: z.coerce.number().min(1, 'Deve ser pelo menos 1 minuto').max(120, 'Máximo 120 minutos'),
  breakDuration: z.coerce.number().min(1, 'Deve ser pelo menos 1 minuto').max(60, 'Máximo 60 minutos'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      workDuration: settings.workDuration,
      breakDuration: settings.breakDuration,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings({
      workDuration: data.workDuration,
      breakDuration: data.breakDuration,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações do Pomodoro</DialogTitle>
          <DialogDescription>
            Personalize a duração dos seus ciclos de foco e intervalos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workDuration"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Duração do Foco (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tempo dedicado ao trabalho focado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breakDuration"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Duração do Intervalo (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tempo de descanso entre os ciclos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Salvar Configurações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
