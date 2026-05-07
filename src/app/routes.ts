import { createBrowserRouter } from "react-router";
import { HeroLanding } from "./pages/HeroLanding";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DashboardPetani } from "./pages/DashboardPetani";
import { DashboardDistributor } from "./pages/DashboardDistributor";
import { DashboardPerusahaan } from "./pages/DashboardPerusahaan";
import { PetaniAI } from "./pages/PetaniAI";
import { Dashboard } from "./pages/Dashboard";
import { InputDataTanam } from "./pages/InputDataTanam";
import { PrediksiPanen } from "./pages/PrediksiPanen";
import { PetaPrediksi } from "./pages/PetaPrediksi";
import { DashboardIntelijen } from "./pages/DashboardIntelijen";
import { Marketplace } from "./pages/Marketplace";
import { Notifications } from "./pages/Notifications";
import { RiwayatKontrak } from "./pages/RiwayatKontrak";
import { PremiumHub } from "./pages/premium/PremiumHub";
import { SubscriptionDashboard } from "./pages/premium/SubscriptionDashboard";
import { KomisiMarketplace } from "./pages/premium/KomisiMarketplace";
import { SmartContract } from "./pages/premium/SmartContract";
import { AnalyticReport } from "./pages/premium/AnalyticReport";
import { ApiIntegration } from "./pages/premium/ApiIntegration";
import { Profile } from "./pages/Profile";
import { SplashScreen } from "./pages/SplashScreen";
import { BuatKontrak } from "./pages/BuatKontrak";

export const router = createBrowserRouter([
  { path: "/", Component: SplashScreen },
  { path: "/home", Component: HeroLanding },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  // Role-based dashboards
  { path: "/dashboard/petani", Component: DashboardPetani },
  { path: "/dashboard/petani/ai", Component: PetaniAI },
  { path: "/dashboard/distributor", Component: DashboardDistributor },
  { path: "/dashboard/perusahaan", Component: DashboardPerusahaan },
  { path: "/profile", Component: Profile },
  // Legacy routes (keep for compatibility)
  { path: "/dashboard", Component: Dashboard },
  { path: "/input-data", Component: InputDataTanam },
  { path: "/prediksi-panen", Component: PrediksiPanen },
  { path: "/peta-prediksi", Component: PetaPrediksi },
  { path: "/intelijen-pasokan", Component: DashboardIntelijen },
  { path: "/marketplace", Component: Marketplace },
  { path: "/notifications", Component: Notifications },
  { path: "/riwayat-kontrak", Component: RiwayatKontrak },
  { path: "/buat-kontrak", Component: BuatKontrak },
  // Premium & Monetization
  { path: "/premium", Component: PremiumHub },
  { path: "/premium/subscription", Component: SubscriptionDashboard },
  { path: "/premium/komisi", Component: KomisiMarketplace },
  { path: "/premium/kontrak", Component: SmartContract },
  { path: "/premium/analitik", Component: AnalyticReport },
  { path: "/premium/api", Component: ApiIntegration },
]);