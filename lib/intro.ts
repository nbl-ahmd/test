type Listener = () => void;

let revealed = false;
const listeners = new Set<Listener>();

export function markRevealed(): void {
  if (revealed) return;
  revealed = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function onRevealed(listener: Listener): () => void {
  if (revealed) {
    listener();
    return () => {};
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}