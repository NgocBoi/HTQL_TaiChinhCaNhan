import LoadingSpinner from './LoadingSpinner';

export default function PageLoader({ label = 'Đang tải dữ liệu...' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="xl" label={label} />
    </div>
  );
}
