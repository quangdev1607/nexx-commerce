import { CheckCircle } from "lucide-react";

type FormSuccessProps = {
  message?: string;
};

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-x-2 rounded-md bg-teal-400/50 p-3 text-sm dark:bg-teal-400/70">
      <CheckCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
