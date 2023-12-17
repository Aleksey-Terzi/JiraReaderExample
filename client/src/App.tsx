import { Container } from 'react-bootstrap';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserToken } from './helpers/userHelper';
import { Header } from './components/Header';

export function App() {
    const location = useLocation();
    const navigate = useNavigate();

    if (!getUserToken()) {
        navigate("/login");
    }

    return location.pathname === "/" ? (
        <Navigate to="/reports/dev" />
    ) : (
        <>
            <Header />
            <Container className="p-3">
                <Container className="p-5 mb-4 bg-light rounded-3">
                    <Outlet />
                </Container>
            </Container>
        </>
    );
}