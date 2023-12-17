import { FormEvent, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { Client } from "../../api/client";
import { LoadingButton } from "../../components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";

interface Fields {
    username?: string;
    password?: string;
    confirmPassword?: string;
}

interface Errors {
    username: {
        error?: string;
    },
    password: {
        error?: string;
    },
    confirmPassword: {
        error?: string;
    }
}

function getFields(form: HTMLFormElement): Fields {
    const formData = new FormData(form);
    return {
        username: formData.get("name") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string
    };
}

function getErrors(fields: Fields): Errors {
    return {
        username: {
            error: !fields.username || fields.username.length === 0 ? "Username is a required field" : undefined
        },
        password: {
            error: !fields.password || fields.password.length === 0 ? "Password is a required field" : undefined
        },
        confirmPassword: {
            error: !fields.confirmPassword || fields.confirmPassword.length === 0
                ? "Confirm password is a required field"
                : fields.confirmPassword !== fields.password ? "Confirm password is not equals to password" : undefined
        }
    };
}

export function Register() {
    const [errors, setErrors] = useState<Errors>();
    const [errorText, setErrorText] = useState<string>();
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const fields = getFields(e.currentTarget);
        const errors = getErrors(fields);

        if (!errors.username.error && !errors.password.error && !errors.confirmPassword.error) {
            await createUser(fields);
        } else {
            showErrors(errors);
        }
    }

    async function createUser(fields: Fields) {
        try {
            setSubmitting(true);
            await Client.register(fields.username!, fields.password!);
            navigate("/login");
        } catch (e) {
            const err = e as Error;
            setErrorText(err.message);
            setSubmitting(false);
        }
    }

    function showErrors(errors: Errors) {
        setErrors(errors);

        let controlName;

        if (errors.username.error) {
            controlName = "name";
        } else if (errors.password.error) {
            controlName = "password";
        } else {
            controlName = "confirmPassword";
        }

        (document.querySelector(`[name='${controlName}']`) as HTMLElement).focus();
    }

    return (
        <div className="container container-body" style={{ width: "350px", paddingTop: "70px" }}>
            <h1 className="mb-3">Create a new user</h1>

            {errorText && <Alert variant="danger">{errorText}</Alert>}

            <Form noValidate autoComplete="off" onSubmit={onSubmit}>
                <FormField title="Username">
                    <Form.Control
                        type="text"
                        name="name"
                        autoFocus
                        isInvalid={!!errors?.username?.error}
                        title={errors?.username?.error}
                        disabled={submitting}
                    />
                </FormField>

                <FormField title="Password">
                    <Form.Control
                        required
                        type="password"
                        name="password"
                        isInvalid={!!errors?.password?.error}
                        title={errors?.password?.error}
                        disabled={submitting}
                    />
                </FormField>

                <FormField title="Confirm Password">
                    <Form.Control
                        required
                        type="password"
                        name="confirmPassword"
                        isInvalid={!!errors?.confirmPassword?.error}
                        title={errors?.confirmPassword?.error}
                        disabled={submitting}
                    />
                </FormField>

                <LoadingButton
                    type="submit"
                    loading={submitting}
                    text="Create User"
                    variant="success"
                    loadingText="Submitting..."
                />
            </Form>
        </div>
    );
}