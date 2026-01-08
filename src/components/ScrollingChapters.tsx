
import React from 'react';

const chapters = [
    { name: 'Infosys Campus Connect', image: '/assets/chapters/infosys_logo.jpg' },
    { name: 'ISTE', image: '/assets/chapters/iste.jpg' },
    { name: 'IWWA', image: '/assets/chapters/iwwa.jpg' },
    { name: 'NCCM', image: '/assets/chapters/nccm.jpg' },
    { name: 'NSSM', image: '/assets/chapters/nssm.jpg' },
    { name: 'SAE India', image: '/assets/chapters/saeind.jpg' },
    { name: 'UGC', image: '/assets/chapters/ugc.jpg' },
    { name: 'SKF', image: '/assets/chapters/skf.jpg' },
    { name: 'ACM', image: '/assets/chapters/acm.png' },
    { name: 'AICTE', image: '/assets/chapters/aicte-logo.jpg' },
    { name: 'ASCE', image: '/assets/chapters/ASCE_logo_large.jpg' },
    { name: 'COA', image: '/assets/chapters/coa.png' },
    { name: 'COE', image: '/assets/chapters/coe.jpg' },
    { name: 'CSI', image: '/assets/chapters/csi.jpg' },
    { name: 'IET', image: '/assets/chapters/iet.jpg' },
    { name: 'IEEE', image: '/assets/chapters/ieee.jpg' },
    { name: 'IETE', image: '/assets/chapters/iete.jpg' },
    { name: 'IIT BombayX', image: '/assets/chapters/iitbombayx.jpg' },
];

const ChapterCard = ({ chapter, isDarkMode }: { chapter: { name: string; image: string }; isDarkMode: boolean }) => {
    return (
        <div
            className={`flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl border flex items-center justify-center p-2 sm:p-3 transition-all hover:scale-105 ${isDarkMode
                ? "bg-slate-900/50 border-blue-600/20"
                : "bg-white border-gray-200 shadow-sm"
                }`}
        >
            <img
                src={chapter.image}
                alt={chapter.name}
                className="max-w-full max-h-full object-contain"
            />
        </div>
    );
};

const ScrollingChapters = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <section className="w-full py-6 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-6">
                    <h3
                        className={`text-lg sm:text-xl font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Chapters & Associations
                    </h3>
                </div>

                {/* Scrolling Container */}
                <div className="relative">
                    <div
                        className="overflow-hidden"
                        style={{
                            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
                        }}
                    >
                        <div className="flex animate-scroll-chapters gap-4 sm:gap-6 w-max">
                            {/* First Set */}
                            {chapters.map((chapter, index) => (
                                <ChapterCard key={index} chapter={chapter} isDarkMode={isDarkMode} />
                            ))}
                            {/* Duplicate Set for Continuous Scroll */}
                            {chapters.map((chapter, index) => (
                                <ChapterCard key={`dup-${index}`} chapter={chapter} isDarkMode={isDarkMode} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes scroll-chapters {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-chapters {
          animation: scroll-chapters 40s linear infinite;
        }
        .animate-scroll-chapters:hover {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .animate-scroll-chapters {
            animation-duration: 20s;
          }
        }
      `}</style>
        </section >
    );
};

export default ScrollingChapters;
