import ModelViewer from "./StaticModelViewer";

interface Props {
  name: string;
  path: string;
  setAvatar: any;
}

export default function ModelCard({ name, path, setAvatar }: Props) {
  return (
    <>
      <div
        className="flex flex-col gap-4 text-center"
        onClick={() => setAvatar([name, path])}
      >
        <div className="hover:-translate-y-4 hover:cursor-pointer">
          <ModelViewer modelPath={path} />
        </div>
        <button className="hover:translate-y-1">{name}</button>
      </div>
    </>
  );
}
