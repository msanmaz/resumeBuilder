/* eslint-disable react/prop-types */
// src/components/common/EnhancedTextarea.jsx
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentEnhancement } from "../../hooks/useContentEnhancement";

const EnhancedTextarea = ({
  value,
  onChange,
  onAccept,
  placeholder,
  section,
  contextData,
  contextBuilder,
  rows = 5,
  className
}) => {
  const {
    enhancedText,
    isEnhanced,
    isLoading,
    error,
    fieldErrors,
    enhance,
    setEnhancedText,
    setIsEnhanced,
    setError
  } = useContentEnhancement(section, contextBuilder);

  const handleGenerate = async () => {
    await enhance(value, contextData);
  };

  const handleAccept = () => {
    const textToAccept = typeof enhancedText === 'object' ? enhancedText.enhanced : enhancedText;
    onChange(textToAccept);
    setIsEnhanced(false);
    setEnhancedText('');
    onAccept?.();
  };

  const handleRetry = () => {
    handleGenerate();
  };

  return (
    <div className="group/enhanced space-y-3">
      {!isEnhanced ? (
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                // Clear error when user starts typing
                if (error) setError(null);
              }}
              placeholder={placeholder}
              rows={rows}
              className={cn(
                "pr-32",
                error && "border-red-500 focus:border-red-500",
                className
              )}
            />
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !value?.trim()}
              className="absolute right-2 top-2 bg-primary-500/20 hover:bg-primary-500/40 text-primary-400 gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate
            </Button>
          </div>
          {error && (
            <div className="text-sm text-red-400 px-1 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {Object.entries(fieldErrors).map(([field, message]) => (
                      <li key={field} className="text-xs">
                        <span className="font-medium">{field}:</span> {message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/50 bg-white/5 backdrop-blur-md p-4 space-y-4">
          <div className="relative">
            <label className="absolute -top-7 left-3 rounded-md bg-[#1B1239] px-2 py-1 text-sm font-light text-white/70">
              Enhanced Version
            </label>
            <Textarea
              value={enhancedText}
              readOnly
              className="w-full resize-none bg-transparent font-medium"
              rows={rows}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRetry}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-l-xl border border-yellow-400 bg-yellow-400/20 text-white hover:bg-yellow-400/40"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Retry
            </Button>
            <Button
              onClick={handleAccept}
              className="flex items-center gap-2 rounded-r-xl bg-emerald-400/60 text-white hover:bg-emerald-400/80"
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTextarea;