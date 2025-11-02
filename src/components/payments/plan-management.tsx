
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plan } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AddEditPlanDialog } from './add-edit-plan-dialog';

interface PlanManagementProps {
    plans: Plan[];
    onAdd: (plan: Omit<Plan, 'id'>) => Promise<void>;
    onEdit: (plan: Plan) => Promise<void>;
    onDelete: (planId: string) => Promise<void>;
}

export function PlanManagement({ plans, onAdd, onEdit, onDelete }: PlanManagementProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const handleAddClick = () => {
        setEditingPlan(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (plan: Plan) => {
        setEditingPlan(plan);
        setIsDialogOpen(true);
    };

    const handleSave = async (planData: Omit<Plan, 'id'> | Plan) => {
        if ('id' in planData) {
            await onEdit(planData);
        } else {
            await onAdd(planData);
        }
    };


    return (
        <>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <div>
                        <CardTitle>Membership Plans</CardTitle>
                        <CardDescription>Manage your gym's membership plans and pricing.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Plan
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plan Name</TableHead>
                                    <TableHead>Duration (Months)</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.length > 0 ? plans.map(plan => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>{plan.duration}</TableCell>
                                        <TableCell>₹{plan.price.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(plan)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(plan.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No plans created yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <AddEditPlanDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSave}
                plan={editingPlan}
            />
        </>
    );
}
