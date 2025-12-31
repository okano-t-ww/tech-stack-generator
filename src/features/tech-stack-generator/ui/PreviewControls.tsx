import { Toggle } from "@/shared/ui/toggle";
import { Combobox } from "@/shared/ui/components/Combobox";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

interface PreviewControlsProps {
  perLine: PerLine;
  onPerLineChange: (value: PerLine) => void;
  includeTitle: boolean;
  onIncludeTitleChange: (value: boolean) => void;
}

export const PreviewControls = ({
  perLine,
  onPerLineChange,
  includeTitle,
  onIncludeTitleChange,
}: PreviewControlsProps) => {
  return (
    <div className="flex flex-row gap-2 items-center flex-wrap">
      <label className="form-label">Preview</label>
      <Combobox
        items={[
          { value: "5", label: "5" },
          { value: "6", label: "6" },
          { value: "7", label: "7" },
          { value: "8", label: "8" },
          { value: "9", label: "9" },
          { value: "10", label: "10" },
        ]}
        placeholder="per line"
        defaultValue="10"
        disableSearch
        onSelect={(value) => {
          onPerLineChange(Number(value) as PerLine);
        }}
        width="120px"
        height="25px"
      />
      <Toggle
        pressed={includeTitle}
        onClick={() => onIncludeTitleChange(!includeTitle)}
        className="text-xs h-[25px]"
      >
        Include Title
      </Toggle>
    </div>
  );
};
