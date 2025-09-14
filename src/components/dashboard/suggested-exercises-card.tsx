'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { suggestExercises } from '@/ai/flows/suggested-exercises';
import { currentWorkout, historicalPerformance } from '@/lib/mock-data';

export function SuggestedExercisesCard() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSuggestExercises = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await suggestExercises({
        currentWorkout,
        historicalPerformance,
        fitnessGoal: 'strength',
      });
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
          throw new Error('No suggestions returned.');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to get suggestions: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent" />
          <span>AI Workout Suggestions</span>
        </CardTitle>
        <CardDescription>Get personalized exercise ideas for your next session.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{suggestion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Click the button to generate ideas based on your recent performance.</p>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSuggestExercises} disabled={isLoading} className="w-full">
          {isLoading ? 'Generating...' : suggestions.length > 0 ? 'Regenerate Suggestions' : 'Get Suggestions'}
        </Button>
      </CardFooter>
    </Card>
  );
}
