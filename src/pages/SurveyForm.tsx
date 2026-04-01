import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GroupRatingCard from "@/components/GroupRatingCard";
import { GROUPS, DIMENSIONS, type GroupName, type DimensionKey, type GroupRanking, saveSubmission } from "@/lib/survey-data";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SurveyForm = () => {
  const navigate = useNavigate();
  const [evaluatorGroup, setEvaluatorGroup] = useState<GroupName | "">("");
  const [ratings, setRatings] = useState<Record<string, GroupRanking>>({});

  const otherGroups = GROUPS.filter((g) => g !== evaluatorGroup);

  const handleRate = (targetGroup: string, dimension: DimensionKey, score: number) => {
    setRatings((prev) => ({
      ...prev,
      [targetGroup]: { ...(prev[targetGroup] || {}), [dimension]: score },
    }));
  };

  const isComplete = () => {
    if (!evaluatorGroup) return false;
    return otherGroups.every((g) =>
      DIMENSIONS.every((d) => ratings[g]?.[d.key] > 0)
    );
  };

  const handleSubmit = () => {
    if (!isComplete()) {
      toast.error("Please rate all dimensions for every group.");
      return;
    }
    saveSubmission({
      evaluatorGroup: evaluatorGroup as GroupName,
      ratings,
      submittedAt: new Date().toISOString(),
    });
    toast.success("Survey submitted successfully!");
    setEvaluatorGroup("");
    setRatings({});
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <h1 className="text-4xl text-primary">Peer Evaluation Survey</h1>
          <p className="text-muted-foreground font-sans">Rate each group across five key dimensions (1–5)</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2">
          <label className="font-sans text-sm font-semibold text-foreground">Your Group</label>
          <Select value={evaluatorGroup} onValueChange={(val) => { setEvaluatorGroup(val as GroupName); setRatings({}); }}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select your group" />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {evaluatorGroup && (
          <div className="space-y-6">
            {otherGroups.map((group, i) => (
              <GroupRatingCard
                key={group}
                groupName={group}
                ratings={ratings[group] || {}}
                onRate={(dim, score) => handleRate(group, dim, score)}
                index={i}
              />
            ))}

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmit} disabled={!isComplete()} className="px-8">
                Submit Survey
              </Button>
              <Button variant="outline" onClick={() => navigate("/results")}>
                View Results
              </Button>
            </div>
          </div>
        )}

        {!evaluatorGroup && (
          <div className="text-center pt-8">
            <Button variant="outline" onClick={() => navigate("/results")}>View Results</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyForm;
