import { TriangleAlert } from "lucide-react";

type FormErrorProps = {
  message?: string;
};

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/50 p-3 text-sm dark:bg-destructive/70">
      <TriangleAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
