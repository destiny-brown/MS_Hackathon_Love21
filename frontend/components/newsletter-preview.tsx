"use client";

interface NewsletterPreviewProps {
  content: string;
}

export function NewsletterPreview({ content }: NewsletterPreviewProps) {
  // Split content into sections by double newlines
  const sections = content.split('\n\n').filter(s => s.trim());

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-[#e8496b] px-6 py-5 text-center sm:px-8 sm:py-6">
        <h1 className="text-xl font-bold text-white sm:text-2xl">LOVE 21 FOUNDATION</h1>
        <p className="text-xs text-white/80 sm:text-sm">
          #SoMuchAbility · Empowering the Down syndrome & autistic community in Hong Kong
        </p>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 sm:px-8 sm:py-6 sm:space-y-6">
        {sections.map((section, index) => {
          const lines = section.split('\n').filter(l => l.trim());
          if (lines.length === 0) return null;

          // Check if it looks like a heading
          const isHeading = lines[0].match(/^(Subject|Dear|Program|Event|Impact|Get Involved|Our Story|Programme Highlights|Events|Our Impact|Get Involved)/i);
          if (isHeading) {
            return (
              <div key={index}>
                <h2 className="text-lg font-bold text-[#e8496b] border-l-4 border-[#e8496b] pl-3 sm:text-xl">
                  {lines[0].replace(/^[🌟💪❤️🤝📅📊🙏🎟️🏆]+\s*/, '')}
                </h2>
                {lines.slice(1).map((line, i) => (
                  <p key={i} className="mt-2 text-sm text-gray-700 sm:text-base">
                    {line}
                  </p>
                ))}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-sm text-gray-700 leading-relaxed sm:text-base">
              {lines.join(' ')}
            </p>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-[#efe7e0] px-4 py-3 text-center text-xs text-gray-600 sm:px-8 sm:py-4 sm:text-sm">
        <p>© 2026 Love 21 Foundation · San Po Kong, Hong Kong</p>
        <p className="mt-1">
          <a href="#" className="text-[#e8496b] hover:underline">Unsubscribe</a>
          {' · '}
          <a href="#" className="text-[#e8496b] hover:underline">View in browser</a>
        </p>
      </div>
    </div>
  );
}