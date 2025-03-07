import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  userId: string;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: Date;
}

export const fetchTodos = async (userId: string): Promise<Todo[]> => {
  try {
    const todosCollection = collection(db, 'todos');
    const q = query(todosCollection, where("userId", "==", userId));
    const data = await getDocs(q);
    const todosData: Todo[] = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      priority: doc.data().priority || 'Low',
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
    })) as Todo[];

    // Sort the todos by priority (High, Medium, Low) and then by the createdAt field (oldest to newest)
    const priorityOrder: { [key: string]: number } = { 'High': 1, 'Medium': 2, 'Low': 3 };
    todosData.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return todosData;
  } catch (error) {
    console.error("Error fetching todos: ", error);
    return [];
  }
};

export default fetchTodos