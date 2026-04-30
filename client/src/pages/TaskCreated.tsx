import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { fetchUserTasks, toggleTaskComplete } from '../redux/tasks/taskSlice';

const TaskCreated = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchUserTasks());
    }, [dispatch]);

    const handleToggle = async (taskId: string) => {
        try {
            await dispatch(toggleTaskComplete(taskId)).unwrap();
            toast.success('Task updated!');
        } catch {
            toast.error('Failed to update task');
        }
    };

    if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>

            {!tasks || tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => {
                        const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                        return (
                            <li key={task._id} className={`border rounded p-3 bg-white shadow ${isOverdue ? 'border-red-300' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-gray-500">
                                            Due: {new Date(task.dueDate).toDateString()}
                                        </p>
                                        {isOverdue && (
                                            <p className="text-xs text-red-600 font-medium mt-1">
                                                ⚠ Overdue — ${Math.floor((Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24))} fine
                                            </p>
                                        )}
                                        <p className={`text-xs font-medium mt-1 ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {task.completed ? '✓ Completed' : '○ Pending'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(task._id)}
                                        className={`px-3 py-1 text-sm rounded ${task.completed
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                    >
                                        {task.completed ? 'Undo' : 'Complete'}
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default TaskCreated;
