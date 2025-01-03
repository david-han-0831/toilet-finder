import DetailContent from './DetailContent';

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function DetailPage({ params }: DetailPageProps) {
  return (
    <DetailContent id={params.id} />
  );
} 