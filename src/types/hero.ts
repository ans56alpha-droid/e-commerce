export interface HeroData {
    title: string;
    description: string;
    primaryButton: {
      label: string;
      href: string;
    };
    secondaryButton: {
      label: string;
      href: string;
    };
    image: string;
    imageAlt: string;
}