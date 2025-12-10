import Image from "next/image";

const sampleImages = [
  {
    url: "https://my-1st-aws-bucket-for-files-storage.s3.eu-north-1.amazonaws.com/edmypic/example/ai-generated-8817541_1280.png",
    height: 1280,
    width: 717,
  },
  {
    url: "https://my-1st-aws-bucket-for-files-storage.s3.eu-north-1.amazonaws.com/edmypic/example/Blue+Macaron+Grid.png",
    height: 1200,
    width: 1200,
  },
  {
    url: "https://my-1st-aws-bucket-for-files-storage.s3.eu-north-1.amazonaws.com/edmypic/example/Close-up+of+Orchid+Flower.png",
    width: 715,
    height: 1200,
  },
  {
    url: "https://my-1st-aws-bucket-for-files-storage.s3.eu-north-1.amazonaws.com/edmypic/example/Portrait+in+Red+and+Yellow.png",
    width: 900,
    height: 1200,
  },
  {
    url: "https://my-1st-aws-bucket-for-files-storage.s3.eu-north-1.amazonaws.com/edmypic/example/woman-9187786_1280.jpg",
    width: 1280,
    height: 875,
  },
];

export function SampleImages({
  onSelect,
}: {
  onSelect: ({
    url,
    width,
    height,
  }: {
    url: string;
    width: number;
    height: number;
  }) => void;
}) {
  return (
    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-500">
        Nothing to upload?{" "}
        <span className="text-gray-300">Try a sample image:</span>
      </p>
      <div className="mt-3 flex gap-4 overflow-x-auto max-md:-mx-4 max-md:px-4 max-md:pb-4">
        {sampleImages.map((sample) => (
          <button
            key={sample.url}
            className="group relative shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-900"
            onClick={() => {
              onSelect({
                url: sample.url,
                width: sample.width,
                height: sample.height,
              });
            }}
          >
            <Image
              src={sample.url}
              width={sample.width}
              height={sample.height}
              alt=""
              className="aspect-[4/3] w-[110px] object-contain"
            />

            <div className="absolute inset-px rounded-lg ring-1 ring-white/5 group-hover:ring-white/15" />
          </button>
        ))}
      </div>
    </div>
  );
}
