
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { historicalPerformance } from '@/lib/mock-data';
import { parseISO } from 'date-fns';
import { Badge } from '../ui/badge';

function getStreak(dates: Date[]) {
    if (dates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = dates.map(d => d.getTime()).sort((a, b) => b - a);
    
    let longestStreak = 0;
    let currentStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const uniqueDays = [...new Set(sortedDates.map(d => {
        const date = new Date(d);
        date.setHours(0,0,0,0);
        return date.getTime();
    }))];

    let tempCurrentStreak = 0;

    if (uniqueDays.includes(today.getTime()) || uniqueDays.includes(yesterday.getTime())) {
        tempCurrentStreak = uniqueDays.includes(today.getTime()) ? 1 : 0;
        let lastDate = uniqueDays.includes(today.getTime()) ? today.getTime() : yesterday.getTime();

        if (uniqueDays.includes(today.getTime()) && uniqueDays.includes(yesterday.getTime())) {
            tempCurrentStreak = 1;
        } else if (uniqueDays.includes(yesterday.getTime())) {
             tempCurrentStreak = 1;
        }

        for (let i = 1; i < uniqueDays.length; i++) {
            const currentDate = new Date(lastDate);
            currentDate.setDate(currentDate.getDate() - 1);
            if (uniqueDays.includes(currentDate.getTime())) {
                tempCurrentStreak++;
                lastDate = currentDate.getTime();
            } else {
                break;
            }
        }
    }
     currentStreak = tempCurrentStreak;

    let tempLongestStreak = 0;
    for(let i = 0; i < uniqueDays.length; i++){
        let streak = 1;
        let lastDate = uniqueDays[i];
        for(let j = i + 1; j < uniqueDays.length; j++){
            const nextDate = new Date(lastDate);
            nextDate.setDate(nextDate.getDate() -1);
            if(uniqueDays.includes(nextDate.getTime())){
                streak++;
                lastDate = nextDate.getTime();
            } else {
                break;
            }
        }
        if(streak > tempLongestStreak){
            tempLongestStreak = streak;
        }
    }
    longestStreak = tempLongestStreak;


    return { current: currentStreak, longest: longestStreak };
}


export function StreakCalendar() {
  const workoutDates = historicalPerformance.map(w => parseISO(w.date));
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const streak = getStreak(workoutDates);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Streak</CardTitle>
        <CardDescription>
            Your workout consistency at a glance. Keep the flame alive!
        </CardDescription>
        <div className="flex gap-4 pt-2">
            <Badge variant="secondary">Current Streak: {streak.current} days</Badge>
            <Badge variant="secondary">Longest Streak: {streak.longest} days</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            workout: workoutDates,
          }}
          modifiersStyles={{
            workout: {
              border: '2px solid hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              backgroundColor: 'hsl(var(--primary) / 0.2)'
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
