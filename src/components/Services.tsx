import { motion } from 'motion/react';
import { Home, Paintbrush, Building2, Compass, FileText, ArrowUpRight } from 'lucide-react';

const services = [
  {
    title: 'Refurbishment Services',
    description: 'Expert structural and aesthetic renovation of existing buildings to modern standards.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Architectural Planning',
    description: 'Comprehensive planning and design for residential and commercial building projects.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1621873100346-608460144983?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'HSIDC & Huda Files',
    description: 'Professional documentation and filing services for HSIDC and Huda approvals.',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'DTP & Layout Design',
    description: 'Precise DTP file creation and architectural layout designs for various building types.',
    icon: Paintbrush,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Interior Design',
    description: 'Premium interior solutions tailored for luxury homes and office spaces.',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1581850518616-bcb8188c4436?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.5em] text-luxury-gold font-accent font-semibold block mb-4">
              Our Expertise
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
              Comprehensive Design <br />
              <span className="italic">Solutions for Every Space</span>
            </h2>
          </div>
          <p className="text-luxury-ink/60 max-w-sm font-light leading-relaxed">
            From initial concept to final execution, we provide end-to-end interior design services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-luxury-bg p-8 hover:shadow-2xl transition-all duration-500 flex flex-col h-[450px]"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-500">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-luxury-ink/60 leading-relaxed font-light mb-8">
                  {service.description}
                </p>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                 <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-auto relative z-10">
                <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-accent font-bold group-hover:gap-4 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute top-0 right-0 p-8">
                <span className="text-5xl font-serif opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  0{index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
