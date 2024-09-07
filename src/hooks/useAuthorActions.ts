import { useCallback } from "react";
import { toast } from "sonner";

export function useAuthorActions() {
  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
    console.log("SUCCESS ===> ", message);
  }, []);

  const handleError = useCallback((message: string) => {
    toast.error(message);
    console.log("ERROR ===> ", message);
  }, []);

  return {
    handleSuccess,
    handleError,
  };
}
