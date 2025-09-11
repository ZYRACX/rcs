import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GlobalChat() {
    return (
        <div className="dark flex flex-col h-[400px] border rounded-md">
            <div className="dark flex-1 overflow-y-auto p-2 space-y-2 ">

                <p className="dark text-center text-gray-400">No messages yet</p>
                <div className="text-sm">
                    <span className="dark font-semibold text-purple-600">Username:</span>{' '}
                    <span>text here</span>
                </div>

            </div>
            <div className="p-2 border-t flex gap-2">
                <Input type="text"
                    placeholder="Type a message"
                />
                <Button>Send</Button>
            </div>
            
        </div>
    );
}
