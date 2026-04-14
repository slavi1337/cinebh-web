type PageStatusCardProps = {
  label: string;
};

export default function PageStatusCard({ label }: PageStatusCardProps) {
  return (
    <div className="rounded-3xl border border-border-default bg-white px-6 py-20 text-center shadow-page-input">
      <p className="text-body-md text-page-muted">{label}</p>
    </div>
  );
}
