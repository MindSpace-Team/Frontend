import { Suspense } from 'react';
import CanvasClientComponent from './CanvasClientComponent';

export default function CanvasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CanvasClientComponent />
    </Suspense>
  );
}