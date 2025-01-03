import { Suspense } from 'react';
import DetailContent from './DetailContent';

interface DetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function DetailPage({ params }: DetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailContent id={params.id} />
    </Suspense>
  );
} 