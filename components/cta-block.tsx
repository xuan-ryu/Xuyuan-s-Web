import Image from "next/image";
import { Cta } from "@/components/ui/cta";

const SEAL = "/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png";

// "LET'S WORK TOGETHER" marquee with the red seal between repetitions and a
// GET IN TOUCH button pinned over the center, as on the live site.
export function CtaBlock() {
  const items = Array.from({ length: 4 });
  return (
    <section id="cta" className="cta-marquee-section">
      <div className="cta-marquee" aria-hidden="true">
        <div className="cta-marquee-track">
          {items.map((_, i) => (
            <span key={i} className="cta-marquee-item">
              <span>LET&apos;S WORK TOGETHER</span>
              <Image src={SEAL} alt="" width={45} height={89} />
            </span>
          ))}
        </div>
      </div>
      <Cta href="/contact" variant="solid" className="cta-marquee-button">
        GET IN TOUCH
      </Cta>
    </section>
  );
}
