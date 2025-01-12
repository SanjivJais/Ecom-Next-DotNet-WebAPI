import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                // Default options for all toasts
                duration: 5000,
                style: {
                    // background: "#363636",
                    color: "#fff",
                },
                success: {
                    style: {
                        background: "#4caf50",
                    },
                },
                error: {
                    style: {
                        background: "#f44336",
                    },
                },
            }}
        />
    );
};

export default ToastProvider;
