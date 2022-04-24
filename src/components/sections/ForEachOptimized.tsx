/* The below code is licensed under MIT. */
type E = JSX.Element;

// The below code is very ugly but is written to be performant, not stylish.
// If you're confused by any import code: if it's destructured it's the functional version.
interface props<T> { each: T[]; fallback?: E; children: (item: T, index: number) => E; }
export default <T,>({ each, fallback, children }: props<T>): E => {
  if (!each?.length) return fallback ?? <></>;

  let elements: E[] = [];
  for (let i = 0; i < each.length; i++)
    elements[i] = children(each[i], i);

  return <>{elements}</>;
};

// This is a function version for things that need the return to be an array instead of a React Element.
interface functionProps<T> { each: T[], exec: (item: T, index: number) => E, fallback?: E; };
export const ForEachOptimized = <T,>({ each, exec, fallback }: functionProps<T>): E | E[] => {
  if (!each?.length) return fallback ?? <></>;

  let elements: E[] = [];
  for (let i = 0; i < each.length; i++)
    elements[i] = exec(each[i], i);

  return elements;
};
