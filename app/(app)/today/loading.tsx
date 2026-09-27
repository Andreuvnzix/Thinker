export default function TodayLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse px-4 pt-6 md:px-8 md:pt-10">
      <div className="h-8 w-48 rounded bg-secondary" />
      <div className="mt-2 h-3 w-32 rounded bg-secondary" />
      <div className="mt-6 h-10 w-full rounded bg-secondary" />
      <div className="mt-8 h-48 w-full rounded bg-secondary" />
      <div className="mt-8 h-32 w-full rounded bg-secondary" />
    </div>
  );
}
