import React from "react";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";


interface SnackBarProps {
    message: string | React.ReactNode;
    variant?: "default" | "error" | "success" | "warning" | "info" | undefined;
    duration?: number | null | undefined;
    // handleClose: (event?: React.SyntheticEvent, reason?: string) => void;
}



const CustomSnackbar = (props: SnackBarProps) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const action = (key: string | number) => (
        <React.Fragment>
            <Button onClick={() => { closeSnackbar(key); }}>
                Dismiss
                </Button>
        </React.Fragment>
    );

    const enqueueCustomSnackbar = () => {
        enqueueSnackbar(props.message, {
            variant: props.variant,
            autoHideDuration: props.duration,
            action,
            ...props,
        });
    };

    return (
        <div>
            {enqueueSnackbar(props.message, {
                variant: props.variant,
                autoHideDuration: props.duration,
                action,
                ...props,
           })}
        </div>);

}
export default { CustomSnackbar };