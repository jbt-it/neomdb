/**
 * Component that implements a custom Snackbar using notistack
 */
import React from "react";
import { useSnackbar, SnackbarMessage, OptionsObject } from "notistack";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

interface Props {
    snackbarMessage: SnackbarMessage;
    snackProps?: OptionsObject;
    buttonProps?: IconButtonProps;
    iconProps?: SvgIconProps;
    showID?: boolean;
}
const CustomSnackbar = (props: Props) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    /**
     * Default close button for Snackbar with Close Icon.
     */
    const action = (key: string | number) => (
        <React.Fragment>
            <IconButton onClick={() => { closeSnackbar(key); }} {...props.buttonProps}>
                <CloseIcon {...props.iconProps} />
            </IconButton>
        </React.Fragment>
    );
    /**
     * Calls a Snackbar. When showID is set to true,
     * it will return the ID of the Snackbar as React.ReactText.
     */
    const wrapperEnqueueSnackbar = () => {
        const output = enqueueSnackbar(props.snackbarMessage, {
            action,
            ...props.snackProps,
        });
        if (props.showID) {
            return (output);
        }
        return (null);
    };
    return (
        <div>
            {wrapperEnqueueSnackbar()}
        </div>);
};
export default CustomSnackbar;