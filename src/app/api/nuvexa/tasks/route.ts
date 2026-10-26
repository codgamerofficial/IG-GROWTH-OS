import { NextRequest, NextResponse } from 'next/server';
import { generateTaskPlan, advanceTaskStep, cancelTaskPlan } from '@/lib/nuvexa/planner';
import { listTasks, saveTaskPlan } from '@/lib/nuvexa/storage';
import { getDefaultUser } from '@/lib/nuvexa/auth';

export async function GET() {
  const user = getDefaultUser();
  const tasks = listTasks(user.id);
  return NextResponse.json({ success: true, tasks });
}

export async function POST(req: NextRequest) {
  try {
    const user = getDefaultUser();
    const body = await req.json();
    const { action, goal, taskId, permissionGranted } = body;

    if (action === 'create' && goal) {
      const newPlan = generateTaskPlan(user.id, goal);
      saveTaskPlan(newPlan);
      return NextResponse.json({ success: true, task: newPlan });
    }

    if (action === 'advance' && taskId) {
      const tasks = listTasks(user.id);
      const target = tasks.find((t) => t.id === taskId);
      if (!target) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      const { updatedPlan, actionRequired } = advanceTaskStep(target, permissionGranted);
      saveTaskPlan(updatedPlan);
      return NextResponse.json({ success: true, task: updatedPlan, actionRequired });
    }

    if (action === 'cancel' && taskId) {
      const tasks = listTasks(user.id);
      const target = tasks.find((t) => t.id === taskId);
      if (!target) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      const cancelled = cancelTaskPlan(target);
      saveTaskPlan(cancelled);
      return NextResponse.json({ success: true, task: cancelled });
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Task error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
