/** Math4Fun — Field Journal Quest router: routes are wrapped by one persistent journal shell and local game state. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import GameLayout from "./components/GameLayout";
import { GameProvider } from "./contexts/GameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import BossPage from "./pages/BossPage";
import CollectionPage from "./pages/CollectionPage";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import StationPage from "./pages/StationPage";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/map"} component={MapPage} />
      <Route path={"/collection"} component={CollectionPage} />
      <Route path={"/station/:id"} component={StationPage} />
      <Route path={"/boss"} component={BossPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <GameProvider>
            <GameLayout>
              <Router />
            </GameLayout>
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
