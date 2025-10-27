import ProjectCard from '@/components/ProjectCard';

export default function Portfolio() {
  const projects = [
    {
      title: 'Modern Kitchen',
      location: 'Lisbon',
      beforeImage: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=800',
      afterImage: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Luxury Bathroom',
      location: 'Porto',
      beforeImage: 'https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800',
      afterImage: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Full House Renovation',
      location: 'Cascais',
      beforeImage: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
      afterImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Contemporary Kitchen',
      location: 'Sintra',
      beforeImage: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=800',
      afterImage: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Spa Bathroom',
      location: 'Oeiras',
      beforeImage: 'https://images.pexels.com/photos/463996/pexels-photo-463996.jpeg?auto=compress&cs=tinysrgb&w=800',
      afterImage: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Open Plan Living',
      location: 'Almada',
      beforeImage: 'https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=800',
      afterImage: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
  ];

  return (
    <main className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-slate-600 mb-12">Recent projects we're proud of.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={i} {...project} />
          ))}
        </div>
      </div>
    </main>
  );
}
