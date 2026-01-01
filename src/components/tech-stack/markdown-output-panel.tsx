import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { Streamdown } from "streamdown";

interface MarkdownOutputPanelProps {
  generatedMarkdown: string;
  isCopied: boolean;
  onCopy: () => void;
}

export const MarkdownOutputPanel = ({
  generatedMarkdown,
  isCopied,
  onCopy,
}: MarkdownOutputPanelProps) => {
  if (!generatedMarkdown) {
    return (
      <div className="xl:col-span-5 space-y-2">
        <label className="form-label">Generated Output</label>
        <div className="h-100 flex items-center justify-center border-2 border-dashed border-border/30 rounded-xl bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Generate markdown to see output
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-5 space-y-2">
      <label className="form-label">Generated Output</label>
      <div className="space-y-2">
        <div className="border-2 border-primary/20 rounded-xl p-4 bg-linear-to-br from-primary/5 via-transparent to-accent/5 shadow-sm min-h-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-1 rounded-full bg-primary"></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Markdown Preview
            </span>
          </div>
          <div className="markdown-preview">
            <Streamdown
              components={{
                img: ({ src, alt, width, height }) => (
                  <img src={src} alt={alt} width={width} height={height} />
                ),
              }}
            >
              {generatedMarkdown}
            </Streamdown>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            value={generatedMarkdown}
            readOnly
            className="font-mono text-xs"
          />
          <Button size="icon" onClick={onCopy}>
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
