"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SettingsProvider } from "../context/settings-context"
import { PomodoroProvider } from "../context/pomodoro-context"
import { TodoProvider } from "../context/todo-context"
import { ChallengeProvider } from "../context/challenge-context"
import { NotificationPermissionDialog } from "./notification-permission-dialog"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <PomodoroProvider>
        <TodoProvider>
          <ChallengeProvider>
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              <NotificationPermissionDialog />
              {children}
            </NextThemesProvider>
          </ChallengeProvider>
        </TodoProvider>
      </PomodoroProvider>
    </SettingsProvider>
  )
}
