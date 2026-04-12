import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceDashboard from "../modules/invoices/pages/InvoiceDashboard";
import ClientLedger from "../modules/ledger/pages/ClientLedger";
import ReportsDashboard from "../modules/reports/pages/ReportsDashboard";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InvoiceDashboard />} />
                <Route path="/invoices" element={<InvoiceDashboard />} />
                <Route path="/ledger" element={<ClientLedger />} />
                <Route path="/reports" element={<ReportsDashboard />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;