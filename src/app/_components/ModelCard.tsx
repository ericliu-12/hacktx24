import ModelViewer from "./StaticModelViewer";

interface Props {
  name: string;
  path: string;
  setAvatar: any;
}

export default function ModelCard({ name, path, setAvatar }: Props) {
  return (
    <>
      <div className="flex flex-col gap-4 text-center">
        <div className="hover:-translate-y-4 hover:cursor-pointer">
          <ModelViewer modelPath={path} />
        </div>
        <button
          className="hover:translate-y-1"
          onClick={() => setAvatar([name, path])}
        >
          {name}
        </button>
      </div>
    </>
  );
}
