/** Field Journal Quest routes — all screens share the local game provider and journal shell. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthGateProvider } from "./components/AuthGate";
import GameLayout from "./components/GameLayout";
import { GameProvider } from "./contexts/GameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./game/guardianBranding";
import "./game/fiveElementCombat";
import BossPage from "./pages/BossPage";
import TrainingPage from "./pages/TrainingPage";
import CollectionPage from "./pages/CollectionPage";
import Home from "./pages/Home";
import MagicBookPage from "./pages/MagicBookPage";
import MapPage from "./pages/MapPage";
import StationPage from "./pages/StationPage";
import StatsPage from "./pages/StatsPage";
import ShopPage from "./pages/ShopPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CompareProfilesPage from "./pages/CompareProfilesPage";
import StudyCalendarPage from "./pages/StudyCalendarPage";
import ProfilePage from "./pages/ProfilePage";
import AdminQuestionsPage from "./pages/AdminQuestionsPage";
import GeometryPetSelectionPage from "./pages/GeometryPetSelectionPage";

function LegacyStartRedirect() { const [, navigate] = useLocation(); useEffect(() => { navigate("/", { replace: true }); }, [navigate]); return null; }
function Router() { return <Switch><Route path="/" component={Home} /><Route path="/start" component={LegacyStartRedirect} /><Route path="/profile" component={ProfilePage} /><Route path="/geometry-pets" component={GeometryPetSelectionPage} /><Route path="/admin/questions" component={AdminQuestionsPage} /><Route path="/map" component={MapPage} /><Route path="/collection" component={CollectionPage} /><Route path="/magic-book" component={MagicBookPage} /><Route path="/shop" component={ShopPage} /><Route path="/leaderboard" component={LeaderboardPage} /><Route path="/compare" component={CompareProfilesPage} /><Route path="/study-calendar" component={StudyCalendarPage} /><Route path="/station/:id" component={StationPage} /><Route path="/boss" component={() => <BossPage />} /><Route path="/map-boss" component={() => <BossPage />} /><Route path="/map2-boss" component={() => <BossPage mapId={2} />} /><Route path="/training" component={TrainingPage} /><Route path="/stats" component={StatsPage} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><GameProvider><AuthGateProvider><GameLayout><Router /></GameLayout></AuthGateProvider></GameProvider></TooltipProvider></ThemeProvider></ErrorBoundary>; }
