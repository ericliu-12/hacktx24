import ModelViewer from "./StaticModelViewer";

interface Props {
  name: string;
  path: string;
}

export default function ModelCard({ name, path }: Props) {
  return (
    <>
      <div className="flex flex-col gap-4 text-center">
        <div className="hover:-translate-y-4 hover:cursor-pointer">
          <ModelViewer modelPath={path} />
        </div>
        <p>{name}</p>
      </div>
    </>
  );
}
