import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import  {features}  from "./data";
export default function Home() {
  return (
    <main className="nature-theme min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Navbar />

        <section className="home-about" id="about">
          <p className="home-kicker">Welcome to Gleeful</p>
          <h1 className="home-title">Edit photos faster. Export with confidence.</h1>
          <p className="home-description">
            Gleeful is a browser-based photo editor focused on speed and clarity. Adjust your
            image, crop precisely, undo and redo as needed, then export production-ready files in
            seconds.
          </p>
          <Link href="/editor" className="home-cta">
            Open Photo Editor
          </Link>
        </section>

        <section className="features-section" id="features">
          <h2 className="features-title">Features</h2>
          <div className="features-grid">
            {features.map((features) => (
              <article className="feature-card" key={features.title}>
                <h3>{features.title}</h3>
                <p>{features.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
