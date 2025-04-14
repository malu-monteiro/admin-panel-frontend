type ServiceCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-4 group hover:bg-orange-50 rounded-xl transition-all">
      <div className="bg-orange-300 w-16 h-16 rounded-2xl mb-4 flex items-center justify-center overflow-hidden mx-auto transform group-hover:-translate-y-2 transition-all duration-300">
        <img src={icon} alt={title} className="w-10 h-10 object-cover" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
