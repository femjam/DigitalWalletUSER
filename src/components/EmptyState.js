export default function EmptyState({ message = 'Nothing here yet.', icon = '📭' }) {
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: '3rem' }}>{icon}</div>
      <p className="text-muted mt-2 mb-0">{message}</p>
    </div>
  );
}