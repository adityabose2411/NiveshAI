import { Linkedin, Twitter } from "lucide-react";

const TeamSection = () => {
  const team = [
    {
      name: "Arjun Mehta",
      role: "Founder & CEO",
      bio: "Ex-Goldman Sachs. 10+ years in wealth management. IIT Delhi, MBA Wharton.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Priya Sharma",
      role: "Chief Technology Officer",
      bio: "Former Staff Engineer at Razorpay. Built systems processing 1M+ txns/day.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Vikram Desai",
      role: "Head of Research",
      bio: "CFA Charterholder. 8 years at Motilal Oswal AMC managing ₹5000 Cr AUM.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Neha Agarwal",
      role: "Head of Growth",
      bio: "Scaled CRED from 0 to 5M users. Expert in fintech user acquisition.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
  ];

  return (
    <section id="team" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Our Team
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built by <span className="gradient-text">Industry Experts</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our founding team brings together deep expertise from fintech, asset management, 
            and technology to democratize wealth creation for India.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="fintech-card p-6 text-center group"
            >
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-soft group-hover:shadow-elevated transition-shadow"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-trust-900/20 to-transparent" />
              </div>

              {/* Info */}
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-teal-600 font-medium mb-3">
                {member.role}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                <a
                  href={member.linkedin}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-trust-100 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                </a>
                <a
                  href={member.twitter}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-trust-100 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Investors/Backers placeholder */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Backed by leading investors</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
