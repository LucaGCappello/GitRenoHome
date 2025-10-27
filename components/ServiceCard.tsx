interface ServiceCardProps {
  title: string;
  description: string;
}

export default function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
