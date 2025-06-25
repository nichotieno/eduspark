
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type SessionPayload } from '@/lib/session';

interface SessionContextType {
  session: SessionPayload | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.session) {
          setSession(data.session);
        }
      })
      .catch(error => console.error("Failed to fetch session:", error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
