interface UnderDevelopmentProps {
  className?: string;
}

export function UnderDevelopment({ className = "" }: UnderDevelopmentProps) {
  return (
    <p className={`under-development ${className}`}>
      This section is currently under development. Content may be edited, replaced, or updated.
    </p>
  );
}
