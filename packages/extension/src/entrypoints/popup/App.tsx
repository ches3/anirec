import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAutoRecordEnabled, saveAutoRecordEnabled } from "@/utils/settings";
import { PageState } from "./components/PageState";
import { RecentRecords } from "./components/RecentRecords";

export default function App() {
  const [autoRecordEnabled, setAutoRecordEnabled] = useState(true);

  useEffect(() => {
    getAutoRecordEnabled().then((enabled) => {
      setAutoRecordEnabled(enabled);
    });
  }, []);

  const handleToggle = async (checked: boolean) => {
    await saveAutoRecordEnabled(checked);
    setAutoRecordEnabled(checked);
  };

  return (
    <div className="w-100 h-120 p-4 flex flex-col overflow-y-auto text-base font-sans">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <img src="/icon/128.png" alt="AniRec" className="w-5 h-5 mb-1" />
          <h1 className="font-semibold text-lg">AniRec</h1>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={autoRecordEnabled}
            onCheckedChange={handleToggle}
            aria-label="自動記録の有効・無効"
            className="scale-80"
          />
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => browser.runtime.openOptionsPage()}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Tabs
        defaultValue="page-info"
        className="flex flex-col flex-1 min-h-0 mt-3"
      >
        <TabsList className="grid grid-cols-2 w-full shrink-0">
          <TabsTrigger value="page-info">ページ情報</TabsTrigger>
          <TabsTrigger value="recent-records">直近の記録</TabsTrigger>
        </TabsList>
        <TabsContent value="page-info" className="px-2 flex-1 overflow-y-auto">
          <PageState />
        </TabsContent>
        <TabsContent
          value="recent-records"
          className="px-2 flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <RecentRecords />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
