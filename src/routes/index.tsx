import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import CasesPage from "../pages/Cases/CasesPage";
import LegalDashboard from "../pages/Dashboard/LegalDashboard";
import AdminPage from "../pages/AdminPage";
import CalendarPage from "../pages/Calendar/CalendarPage";
import SubscriptionPage from "../pages/Subscription/SubscriptionPage";

import AffiliateAdminPanel from "../pages/Admin/AffiliateAdminPanel";
import InvoiceReportsPage from "../pages/Admin/InvoiceReportsPage";

// Calculators
import CourtFeeCalculator from "../calculators/CourtFee/CourtFeeCalculator";
import FilingCostCalculator from "../calculators/filingCost/FilingCostCalculator";
import InterestCalculator from "../calculators/interest/InterestCalculator";
import LimitationCalculator from "../calculators/limitation/LimitationCalculator";

// Custom Pages
import LimitationPage from "../pages/Limitation/LimitationPage";
import DraftLibraryPage from "../pages/DraftLibrary/DraftLibraryPage";
import CauseListPage from "../pages/CauseList/CauseListPage";
import AIDraftPage from "../pages/AIDraft/AIDraftPage";
import ClientDashboard from "../pages/ClientPortal/ClientDashboard";

// Case Pages
import CaseDetailsPage from "../pages/Cases/CaseDetailsPage";
import ClientsPage from "../pages/Clients/ClientsPage";

import AffiliateDashboard from "../pages/Affiliate/AffiliateDashboard";
import ProfileSettingsPage from "../pages/Profile/ProfileSettingsPage";

import UserGuidePage from "../pages/Public/UserGuidePage";
import AboutUsPage from "../pages/Public/AboutUsPage";
import ContactUsPage from "../pages/Public/ContactUsPage";
import DisclaimerPage from "../pages/Public/DisclaimerPage";
// Public Pages
import PrivacyPolicyPage from "../pages/Public/PrivacyPolicyPage";
import TermsConditionsPage from "../pages/Public/TermsConditionsPage";

// Blog Pages
import BlogListPage from "../pages/Blog/BlogListPage";
import BlogPostPage from "../pages/Blog/BlogPostPage";
import LegalDocumentsPage from "../pages/Public/LegalDocumentsPage";
import { generateLegalPDF } from "../utils/generateLegalPDF";
import GSTInvoicePage from "../pages/Invoices/GSTInvoicePage";
import CreateInvoicePage from "../pages/Invoices/CreateInvoicePage";
import InvoiceListPage from "../pages/Invoices/InvoiceListPage";
import ClientLedgerPage from "../pages/Ledger/ClientLedgerPage";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/cases"
                    element={
                        <ProtectedRoute>
                            <CasesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cases/:id"
                    element={
                        <ProtectedRoute>
                            <CaseDetailsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <ClientsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADVOCATE"]}>
                            <LegalDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cases"
                    element={
                        <ProtectedRoute allowedRoles={["ADVOCATE", "JUNIOR"]}>
                            <CasesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={["CLIENT"]}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/affiliate"
                    element={
                        <ProtectedRoute>
                            <AffiliateDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/affiliates"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AffiliateAdminPanel />
                        </ProtectedRoute>
                    }
                />

                <Route path="/admin/invoices" element={<InvoiceReportsPage />} />

                <Route path="/" element={<LegalDashboard />} />

                <Route path="/court-fee" element={<CourtFeeCalculator />} />
                <Route path="/filing-cost" element={<FilingCostCalculator />} />
                <Route path="/interest" element={<InterestCalculator />} />
                <Route path="/limitation-calc" element={<LimitationCalculator />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/case/:id" element={<CaseDetailsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />

                <Route path="/limitation" element={<LimitationPage />} />
                <Route path="/drafts" element={<DraftLibraryPage />} />
                <Route path="/cause-list" element={<CauseListPage />} />
                <Route path="/ai-draft" element={<AIDraftPage />} />

                <Route path="/profile" element={<ProfileSettingsPage />} />

                <Route path="/admin" element={<AdminPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />

                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />

                <Route path="/user-guide" element={<UserGuidePage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                {/* Legal Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />

                {/* Blog */}
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/legal-documents" element={<LegalDocumentsPage />} />
                <Route path="/gst-invoice" element={<GSTInvoicePage />} />
                <Route path="/invoices/create" element={<CreateInvoicePage />} />
                <Route path="/invoices" element={<InvoiceListPage />} />
                <Route path="/ledger/:clientId" element={<ClientLedgerPage />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;

