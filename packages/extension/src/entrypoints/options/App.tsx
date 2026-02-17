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
    <div className="mx-12 mt-2 mb-12 min-w-[400px] text-base font-sans">
      <TokenOption />
      {recordSettings && (
        <>
          <ServiceToggleOption
            className="mt-8"
            enabled={recordSettings.enabledServices}
            onChange={handleEnabledServicesChange}
          />
          <RecordTimingOption
            className="mt-8"
            timing={recordSettings.timing}
            onChange={handleTimingChange}
          />
          <PreventDuplicateOption
            className="mt-8"
            value={recordSettings.preventDuplicateDays}
            onChange={handlePreventDuplicateDaysChange}
          />
        </>
      )}
    </div>
  );
}

export default App;
