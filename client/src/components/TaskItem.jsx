export default function TaskItem({
  text,
}) {
  return (
    <div
      className="
        bg-neutral-700
        rounded
        px-3
        py-2
        text-sm
      "
    >
      {text}
    </div>
  );
}