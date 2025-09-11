import ActivityItem from "@/components/ActivityItem";
import GlobalChat from "@/components/GlobalChat";   
import { Box, Fish, GlobeIcon, Pickaxe, Shield, Text } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* LEFT COLUMN */}
      <div className="space-y-4">
        {/* Status Section */}
        <Card className="dark">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Shield /> Status
            </h2>
            <div className="flex justify-end mt-4">
              <Button className="bg-blue-500 text-white">Show full Status</Button>
            </div>
          </CardContent>
        </Card>

        {/* Activities Section */}
        <Card className="dark grid grid-cols-1 sm:grid-cols-2">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <GlobeIcon /> Activities
            </h2>

              <ActivityItem
                icon={<Pickaxe />}
                tooltip={
                  <>
                    Upgrade your pickaxe to mine more efficiently! <br />
                    Requirements to upgrade: <br />
                    - Level 10 <br />
                    - 500 Dollars <br />
                    - 10 Iron <br />
                    - 10 Wood <br />
                    <Button>Upgrade</Button>
                  </>
                }
                label="Start Mining"
                // onClick={function () {
                //   fetch("/api/activity/mining", { method: "POST" }).then((res) => {
                //     if (res.ok) {
                //       alert("Mining started!");
                //     } else {
                //       alert("Failed to start mining.");
                //     }
                //   });
                // }}
              />

              <ActivityItem
                icon={<Fish />}
                tooltip={
                  <>
                    Upgrade this for more efficient Fishing! <br />
                    Requirements to upgrade: <br />
                    - Level 12 <br />
                    - 300 Dollars <br />
                    - 10 Iron <br />
                    - 10 Wood <br />
                    <Button>Upgrade</Button>
                  </>
                }
                label="Start Fishing"
              />

              <ActivityItem
                icon={<GlobeIcon />}
                tooltip={
                  <>
                    Upgrade your pickaxe to mine more efficiently! <br />
                    Requirements to upgrade: <br />
                    - Level 10 <br />
                    - 500 Dollars <br />
                    - 10 Iron <br />
                    - 10 Wood <br />
                    <Button>Upgrade</Button>
                  </>
                }
                label="Start Exploring"
              />
          </CardContent>

          <CardContent className="p-4 pt-11">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <ActivityItem
                  key={index}
                  icon={<Pickaxe />}
                  tooltip="Coming soon..."
                  label="Coming Soon"
                  disabled
                />
              ))}
          </CardContent>
        </Card>
      </div>

      {/* CENTER COLUMN */}
      <div className="space-y-4">

        <Card className="dark p-2">
          <h2 className="text-xl font-bold flex items-center">
            <Box /> Tasks
          </h2>
          <ScrollArea.Root className="w-full h-64 overflow-hidden rounded-md border">
            <ScrollArea.Viewport className="h-full w-full p-2">
              {["Do mining 10 times", "Do exploring 10 times", "Do Fishing 10 times", "Craft any 10 items"].map(
                (task) => (
                  <Card key={task} className="mb-2">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{task}</h3>
                    </CardContent>
                  </Card>
                )
              )}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex touch-none select-none p-0.5 transition-colors duration-160 ease-out hover:bg-gray-200"
            >
              <ScrollArea.Thumb className="flex-1 rounded-full bg-gray-400" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Card>
      </div>

      {/* RIGHT COLUMN */}
      <div>
        <Card className="dark p-4">
          <CardContent>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Text /> Global Chat
            </h2>
            <GlobalChat />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
