import PageWrapper from "../../components/common/PageWrapper";
import SystemStatus from "../../components/settings/SystemStatus";
import ThemeSelector from "../../components/settings/ThemeSelector";
import InteractivePreferences from "../../components/settings/InteractivePreferences";

const Settings = () => {
  return (
    <PageWrapper className="space-y-8">
      {/* Visual display preferences */}
      <ThemeSelector />

      {/* Audio chimes and particle trails */}
      <InteractivePreferences />

      {/* Hardware calibration system status */}
      <SystemStatus />
    </PageWrapper>
  );
};

export default Settings;
