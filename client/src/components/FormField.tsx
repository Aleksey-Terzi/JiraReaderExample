import { ReactNode } from "react";
import { Form } from "react-bootstrap";

interface Props {
    title: string;
    children: ReactNode
}

export function FormField({ title, children } : Props) {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{title}</Form.Label>
            {children}
        </Form.Group>
    );
}