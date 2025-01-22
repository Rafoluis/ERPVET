import { toast, ToastOptions } from "react-toastify";
import { Bounce } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {}
): void => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    ...options, 
  };

  switch (type) {
    case "success":
      toast.success(message, defaultOptions);
      break;
    case "error":
      toast.error(message, defaultOptions);
      break;
    case "info":
      toast.info(message, defaultOptions);
      break;
    case "warning":
      toast.warning(message, defaultOptions);
      break;
    default:
      console.warn(`Unknown toast type: ${type}`);
  }
};
