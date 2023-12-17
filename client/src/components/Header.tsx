import { Container, Navbar } from "react-bootstrap";
import { getUserName } from "../helpers/userHelper";
import { Link } from "react-router-dom";

export function Header() {
    const username = getUserName();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                Developers' Performance Report
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <b>{username}</b>
                        <Link to="/logout" className="ms-3">
                            logout
                        </Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}