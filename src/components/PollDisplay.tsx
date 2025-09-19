import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { showError } from '@/utils/toast';

interface PollOption {
  id: number;
  option_text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  poll_options: PollOption[];
}

interface PollDisplayProps {
  poll: Poll;
}

export const PollDisplay = ({ poll }: PollDisplayProps) => {
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);
  const [pollData, setPollData] = useState(poll);

  const totalVotes = pollData.poll_options.reduce((acc, option) => acc + option.votes, 0);

  useEffect(() => {
    const savedVote = localStorage.getItem(`voted_poll_${poll.id}`);
    if (savedVote) {
      setVotedOptionId(parseInt(savedVote, 10));
    }
  }, [poll.id]);

  const handleVote = async (optionId: number) => {
    if (votedOptionId) return; // Already voted

    const { error } = await supabase.rpc('increment_vote', { option_id: optionId });

    if (error) {
      showError('Oy verilirken bir hata oluştu.');
      console.error(error);
    } else {
      // Optimistic update
      const updatedOptions = pollData.poll_options.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      setPollData({ ...pollData, poll_options: updatedOptions });
      
      localStorage.setItem(`voted_poll_${poll.id}`, optionId.toString());
      setVotedOptionId(optionId);
    }
  };

  return (
    <div className="mt-4 space-y-3 rounded-lg border p-4">
      <p className="font-semibold text-left">{pollData.question}</p>
      <div className="space-y-2">
        {pollData.poll_options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const hasVoted = votedOptionId !== null;
          const isVotedOption = votedOptionId === option.id;

          if (hasVoted) {
            return (
              <div key={option.id} className="relative">
                <Progress value={percentage} className="h-8" />
                <div className={cn(
                  "absolute inset-0 flex items-center justify-between px-3 text-sm",
                  isVotedOption ? "font-bold text-primary-foreground" : "text-foreground"
                )}>
                  <span>{option.option_text}</span>
                  <span>{Math.round(percentage)}% ({option.votes})</span>
                </div>
              </div>
            );
          } else {
            return (
              <Button
                key={option.id}
                variant="outline"
                className="w-full justify-start text-black"
                onClick={() => handleVote(option.id)}
              >
                {option.option_text}
              </Button>
            );
          }
        })}
      </div>
      {votedOptionId && <p className="text-xs text-muted-foreground text-right">{totalVotes} Toplam Oy</p>}
    </div>
  );
};