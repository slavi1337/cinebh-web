type AuthDividerProps = {
  text: string;
};

export default function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-auth-border" />
      <span className="text-body-md font-normal text-auth-text-primary">
        {text}
      </span>
      <span className="h-px flex-1 bg-auth-border" />
    </div>
  );
}
