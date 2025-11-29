import { Stack } from "expo-router";

const RootLayout = () => {
  return(
    <Stack>
            <Stack.Screen name="Tareas" options={{ headerShown: true}}/>
            <Stack.Screen name="(home)" options={{ headerShown: false}}/>
    </Stack>
  );
};

export default RootLayout;