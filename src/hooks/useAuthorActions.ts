import { useCallback } from "react";
import { toast } from "sonner";

export function useAuthorActions() {
  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const handleError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  return {
    handleSuccess,
    handleError,
  };
}
