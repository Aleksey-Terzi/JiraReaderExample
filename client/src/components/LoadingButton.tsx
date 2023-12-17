import { MouseEvent } from "react";
import { Button, Spinner, Stack } from "react-bootstrap";

interface Props {
    loading: boolean;
    text: string;
    loadingText: string;
    variant?: string;
    type?: "button" | "submit" | undefined;
    disabled?: boolean;
    className?: string;
    onClick?: (e: MouseEvent) => void;
}

export function LoadingButton(props: Props) {
    const variant = props.variant || "outline-secondary";
    const type = props.type || "button";

    return (
        <Button
            type={type}
            variant={variant}
            className={props.className}
            disabled={props.loading || props.disabled}
            onClick={props.onClick}
        >
            {props.loading && (
                <Stack direction="horizontal">
                    <Spinner animation="border" size="sm" className="me-2" />
                    {props.loadingText}
                </Stack>
            )}
            {!props.loading && props.text}
        </Button>
    );
}