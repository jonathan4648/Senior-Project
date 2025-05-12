import { useRoute } from '@react-navigation/native';
import { doc, getDocs, collection, query, where } from 'firebase/firestore';

const ShareTodoScreen = () => {
  const route = useRoute();
  const { shareId } = route.params;

  const [sharedTodo, setSharedTodo] = useState(null);

  useEffect(() => {
    const fetchSharedTodo = async () => {
      const q = query(collection(db, 'todos'), where('shareId', '==', shareId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setSharedTodo(querySnapshot.docs[0].data());
      }
    };

    fetchSharedTodo();
  }, [shareId]);

  return (
    <View>
      {sharedTodo ? (
        <>
          <Text>Task: {sharedTodo.task}</Text>
          <Text>Date: {sharedTodo.date}</Text>
          <Text>Time: {sharedTodo.time}</Text>
          <Text>Location: {sharedTodo.location}</Text>
        </>
      ) : (
        <Text>Loading or not found...</Text>
      )}
    </View>
  );
};
