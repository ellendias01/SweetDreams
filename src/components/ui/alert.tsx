import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

type AlertProps = {
  variant?: "default" | "destructive";
  title: string;
  description?: string;
};

export function Alert({ variant = "default", title, description }: AlertProps) {
  return (
    <View style={[styles.container, variant === "destructive" && styles.destructive]}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff", // padrão
    borderWidth: 1,
    borderColor: "#ccc",
  },
  destructive: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },
});
