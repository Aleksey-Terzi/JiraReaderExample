import { FormEvent, useEffect, useRef, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { Client } from "../../api/client";
import { LoadingButton } from "../../components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";
import { ApiError } from "../../api/models/apiError";

export function Login() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState<string>();
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement>(null);
    const [nameFocused, setNameFocused] = useState(false);

    useEffect(() => {
        const checkHasUsers = async () => {
            const hasUsers = await Client.hasUsers();
            if (hasUsers) {
                setLoading(false);
                setNameFocused(true);
            } else {
                navigate("/register");
            }
        };
        checkHasUsers();
    }, [navigate]);

    useEffect(() => {
        if (nameFocused && nameRef.current) {
            nameRef.current.focus();
            setNameFocused(false);
        }
    }, [nameFocused]);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        if (form.checkValidity() === false) {
            const inputName = !formData.get("name") ? "name" : "password";
            (document.querySelector(`[name='${inputName}']`) as HTMLElement).focus();
            setValidated(true);
        } else {
            await loginUser(formData);
        }
    }

    async function loginUser(formData: FormData) {
        setSubmitting(true);

        try
        {
            const username = formData.get("name") as string;
            const password = formData.get("password") as string;

            await Client.login(username, password);

            navigate("/reports/dev");
        }
        catch (e) {
            const err = e as ApiError;
            if (err.status === 401) {
                setNameFocused(true);
                setError("Username or password is invalid");
            } else {
                setError(err.message);
            }
        }

        setSubmitting(false);
    }

    return (
        <div className="container container-body" style={{ width: "300px", paddingTop: "70px" }}>
            <h1 className="mb-3">Login</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form noValidate autoComplete="off" validated={validated} onSubmit={onSubmit}>
                <FormField title="Username">
                    <Form.Control
                        required
                        type="text"
                        name="name"
                        ref={nameRef}
                        disabled={loading || submitting}
                    />
                </FormField>

                <FormField title="Pasword">
                    <Form.Control
                        required
                        type="password"
                        name="password"
                        disabled={loading || submitting}
                    />
                </FormField>

                <LoadingButton
                    type="submit"
                    loading={submitting}
                    disabled={loading}
                    text="Sign In"
                    variant="success"
                    loadingText="Submitting..."
                />
            </Form>
        </div>
    );
}