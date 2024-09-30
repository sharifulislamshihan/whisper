

import HomeBanner from "@/components/HomeBanner";


export const metadata = {
  title: 'Whisper',
  description: 'Anonymous Feedback Platform',
  icons: {
    icon: '/logo.png', // Path to your favicon
  },
};


export default function Home() {
  return (
      <div>
        <HomeBanner></HomeBanner>
      </div>
  );
}
