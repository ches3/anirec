import { Toaster } from "@/components/ui/sonner";
import {
  getRecordSettings,
  mergeRecordSettings,
  type RecordSettings,
  type RecordSettingsPatch,
  type RecordTiming,
  type ServiceEnabled,
  saveRecordSettings,
} from "@/utils/settings";
import { PreventDuplicateOption } from "./PreventDuplicateOption";
import { RecordTimingOption } from "./RecordTimingOption";
import { ServiceToggleOption } from "./ServiceToggleOption";
import { TokenOption } from "./TokenOption";

function App() {
  const [recordSettings, setRecordSettings] = useState<RecordSettings>();
  const recordSettingsRef = useRef<RecordSettings | null>(null);

  useEffect(() => {
    (async () => {
      const settings = await getRecordSettings();
      recordSettingsRef.current = settings;
      setRecordSettings(settings);
    })();
  }, []);

  const applyRecordSettings = (patch: RecordSettingsPatch) => {
    const prevSettings = recordSettingsRef.current;
    if (!prevSettings) {
      return;
    }
    const nextSettings = mergeRecordSettings(prevSettings, patch);
    recordSettingsRef.current = nextSettings;
    setRecordSettings(nextSettings);
    void saveRecordSettings(nextSettings);
  };

  const handleTimingChange = (patch: Partial<RecordTiming>) => {
    applyRecordSettings({ timing: patch });
  };

  const handleEnabledServicesChange = (nextEnabled: ServiceEnabled) => {
    applyRecordSettings({ enabledServices: nextEnabled });
  };

  const handlePreventDuplicateDaysChange = (days: number) => {
    applyRecordSettings({ preventDuplicateDays: days });
  };

  return (
    <div className="mx-8 mt-2 mb-8 min-w-100 text-sm font-sans">
      <Toaster
        duration={3000}
        toastOptions={{
          style: {
            width: "240px",
            left: "auto",
            right: "var(--offset-right)",
          },
        }}
      />
      <TokenOption />
      {recordSettings && (
        <>
          <ServiceToggleOption
            className="mt-6"
            enabled={recordSettings.enabledServices}
            onChange={handleEnabledServicesChange}
          />
          <RecordTimingOption
            className="mt-6"
            timing={recordSettings.timing}
            onChange={handleTimingChange}
          />
          <PreventDuplicateOption
            className="mt-6"
            value={recordSettings.preventDuplicateDays}
            onChange={handlePreventDuplicateDaysChange}
          />
        </>
      )}
    </div>
  );
}

export default App;
