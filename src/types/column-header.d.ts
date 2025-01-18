interface ColumnHeader<T> {
  id: keyof T;
  label: string;
  className?: string;
}