import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";


export const Test = () => {
  // const { data: posts, isLoading } = api.post.all.useQuery();
 
  return (
    <View style={styles.container}>  
      <Text style={styles.header}>Hi</Text>
      {/* {posts?.map((post) => <Text key={post.id}>{post.title}</Text>)} */}
      <StatusBar style="auto" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
});
