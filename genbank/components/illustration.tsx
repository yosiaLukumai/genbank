import Image from "next/image";

export function Illustration() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="relative h-auto w-auto max-w-md"> {/* Changed h-full and w-full to h-auto and w-auto */}
        <Image 
          src="/images.jpeg" 
          alt="Illustration" 
          width={300}
          priority={true} 
          height={300} 
          style={{ objectFit: 'contain' }} // Added objectFit to ensure image fits within its container
        />
      </div>
    </div>
  );
}