import { toast } from "react-toastify";

export const notify = (message, type) => {
  if (!message) return;
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
  }
};
