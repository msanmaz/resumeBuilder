/* eslint-disable react/prop-types */
// src/components/common/EnhancedAchievementInput.jsx
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, Loader2, Sparkles } from "lucide-react";
import { useEnhanceContentMutation } from '../../../services/api/resumeApi';
import { determineExperienceLevel } from '../../../utils/experienceUtils';
import { cn } from "@/lib/utils"

const EnhancedAchievementInput = ({
  value,
  onChange,
  onAccept,
  placeholder,
  position = {}
}) => {
  const [enhanceContent] = useEnhanceContentMutation();
  const [enhancedText, setEnhancedText] = useState('');
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleGenerate = async () => {
    try {
      setError(null);

      if (!value?.trim()) {
        setError('Please enter some content before generating');
        return;
      }
      setIsLoading(true);
      const experienceLevel = determineExperienceLevel(position);

      const result = await enhanceContent({
        section: 'work',
        content: value,
        context: {
          role: position.position || '',
          industry: position.company || '',
          experienceLevel,
        },
        parameters: {
          temperature: 0.7,
          style: "professional",
          focusAreas: [
            "keywords",
            "achievements",
            "metrics",
            "action_verbs"
          ],
          preserveKeywords: true,
        }
      }).unwrap();
      setEnhancedText(result.enhanced);
      setIsEnhanced(true);
    } catch (error) {
      console.error('Failed to enhance:', error);
      setError(error?.data?.message || 'Failed to enhance content. Please try again.');
      setIsEnhanced(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onChange(enhancedText['enhanced']);
    setIsEnhanced(false);
    setEnhancedText('');
    onAccept?.();
  };

  const handleRetry = () => {
    handleGenerate();
  };

  return (
    <div className="group/achievement space-y-3">
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
              rows={5}
              className={cn(
                "pr-32",
                error && "border-red-500 focus:border-red-500"
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
            <div className="text-sm text-red-400 px-1">
              {error}
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
              value={enhancedText['enhanced']}
              readOnly
              className="w-full resize-none bg-transparent font-medium"
              rows={5}
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

export default EnhancedAchievementInput;