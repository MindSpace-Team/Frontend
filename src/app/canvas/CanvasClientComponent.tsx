'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NodeManager from '@/components/controls/NodeManager';

export default function CanvasClientComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Store the token
      localStorage.setItem('jwt-token', token);
      // Remove the token from the URL
      router.replace('/canvas', undefined);
    }
  }, [token, router]);

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <NodeManager />
    </main>
  );
}
