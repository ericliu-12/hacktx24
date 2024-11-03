import ModelViewer from "./StaticModelViewer";

interface Props {
  name: string;
  path: string;
}

export default function ModelCard({ name, path }: Props) {
  return (
    <>
      <div className="flex flex-col gap-4 text-center">
        <ModelViewer modelPath={path} />
        <p>{name}</p>
      </div>
    </>
  );
}
