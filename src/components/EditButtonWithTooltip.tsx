"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getElectionStatus } from "@/lib/utils";

interface Election {
  _id: string;
  start: string;
  end: string;
}

interface Props {
  election: Election;
}

export default function ElectionEditButton({ election }: Props) {
  const router = useRouter();
  const status = getElectionStatus(election.start, election.end);
  const canEdit = status === "upcoming";

  const handleEdit = () => {
    if (canEdit) {
      router.push(`/admin/dashboard/elections/editElection/${election._id}`);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              size="sm"
              variant="outline"
              disabled={!canEdit}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </span>
        </TooltipTrigger>
        {!canEdit && (
          <TooltipContent>
            Editing is disabled while election is {status}.
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
