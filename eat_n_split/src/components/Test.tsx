export default function Test({ param = "This is param" }: { param?: string }) {
  return <div>{param}</div>;
}
