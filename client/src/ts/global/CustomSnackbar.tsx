/**
 * Component that implements custom Snackbar using notistack
 */
import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { useSnackbar, SnackbarMessage, OptionsObject } from "notistack";

interface Props {
    snackbarMessage: SnackbarMessage;
    snackProps?: OptionsObject;
    buttonProps?: ButtonProps;
}
const CustomSnackbar = (props: Props) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const action = (key: string | number) => (
        <React.Fragment>
            <Button onClick={() => { closeSnackbar(key); }} {...props.buttonProps} >
                Dismiss
                </Button>
        </React.Fragment>
    );
    const wrapperEnqueueSnackbar = () => {
        enqueueSnackbar(props.snackbarMessage, {
            action,
            ...props.snackProps,
        });
        return (null);
    };
    return (
        <div>
            {wrapperEnqueueSnackbar()}
        </div>);
};
export default CustomSnackbar;