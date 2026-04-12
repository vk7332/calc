import DashboardLayout from "../components/layout/DashboardLayout";
import TotalCaseCostCalculator from "../calculators/totalCaseCost/TotalCaseCostCalculator";

export default function TotalCaseCostPage() {
    return (
        <DashboardLayout>
            <TotalCaseCostCalculator />
        </DashboardLayout>
    );
}
