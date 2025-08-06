import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { fetchUserTasks } from '../redux/tasks/taskSlice';

const TaskCreated = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchUserTasks());
    }, [dispatch]);

    if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>

            {!tasks || tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li key={task._id} className="border rounded p-3 bg-white shadow">
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-sm text-gray-500">
                                Due: {new Date(task.dueDate).toDateString()}
                            </p>
                            <p
                                className={`text-xs font-medium mt-1 ${task.completed ? 'text-green-600' : 'text-yellow-600'
                                    }`}
                            >
                                {task.completed ? 'Completed' : 'Pending'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default TaskCreated;
